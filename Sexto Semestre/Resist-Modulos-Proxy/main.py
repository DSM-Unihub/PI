import time
import threading
import hashlib
from tratamentoDados import TratamentoDados
from indexacoes import Indexacoes, Acessos
import requests
import re
import os
from pymongo import MongoClient
from datetime import datetime
from urllib.parse import urlparse, urlunparse
from bloqueio import Bloqueio
from dotenv import load_dotenv
from crypto_utils import filename_from_url, encrypt_and_atomic_write

# Load environment variables from .env
load_dotenv()

# Obtém a string de conexão do MongoDB
mongoDBURI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
bloqueio = Bloqueio(
    arm_file_path=os.getenv('ARM_FILE_PATH', '/root/arm.txt'),
    html_directory=os.getenv('HTML_DUMPS_DIR', '/home/mauricio/Desktop/html_dumps'),
)

# Configuração MongoDB Atlas
print("Tentando conectar ao MongoDB Atlas...")
try:
    client = MongoClient(mongoDBURI)
    print("Conexão ao MongoDB Atlas bem-sucedida!")
except Exception as e:
    print(f"Erro ao conectar ao MongoDB Atlas: {e}")
    client = None

# Verifica se a conexão foi bem-sucedida antes de continuar
if client:
    db = client['PI']

    # Inicializa as classes de tratamento, indexação e acessos
    dado = TratamentoDados(db)
    idx = Indexacoes(db)
    acc = Acessos(db)

    # Semáforo para limitar o número de requisições simultâneas
    semaforo = threading.Semaphore(15)

    # Um lock por URL canônica: evita N Playwrights/Mongo para o mesmo artigo quando
    # o proxy grava várias linhas iguais quase ao mesmo tempo.
    _PIPELINE_REGISTRY_LOCK = threading.Lock()
    _PIPELINE_LOCK_BY_KEY = {}

    def pipeline_lock_for_key(canonical_key):
        if not canonical_key:
            return None
        with _PIPELINE_REGISTRY_LOCK:
            return _PIPELINE_LOCK_BY_KEY.setdefault(canonical_key, threading.Lock())

    class DedupeUrlProcessing:
        """Context manager: impede corrida paralela quando o log repete o mesmo artigo."""

        __slots__ = ("key", "lock", "acquired")

        def __init__(self, key):
            stripped = (key or "").strip()
            self.key = stripped or None
            self.lock = None
            self.acquired = False

        def __enter__(self):
            if not self.key:
                self.acquired = True
                return self
            self.lock = pipeline_lock_for_key(self.key)
            self.acquired = self.lock.acquire(blocking=False)
            return self

        def __exit__(self, exc_type, exc, tb):
            if self.lock is not None and self.acquired:
                self.lock.release()
            return False

    class MonitorLog:
        
        # Adicione esta função para converter a data e hora
        def format_datetime(self, data, hora):
            # Combina a data e a hora em uma única string
            datetime_str = f"{data} {hora}"
            
            # Tenta analisar a string com milissegundos (formato específico para 3 dígitos)
            try:
                # Split the time to handle the milliseconds separately
                date_part, time_part = datetime_str.split(' ')
                time_parts = time_part.split(':')
                if len(time_parts) == 4:  # If we have milliseconds
                    # Reconstruct the string with milliseconds in the correct format
                    new_datetime_str = f"{date_part} {time_parts[0]}:{time_parts[1]}:{time_parts[2]}.{time_parts[3]}"
                    dt = datetime.strptime(new_datetime_str, "%d/%m/%Y %H:%M:%S.%f")
                else:
                    dt = datetime.strptime(datetime_str, "%d/%m/%Y %H:%M:%S")
                
                # Format the output
                return dt.strftime("%d-%m-%YT%H:%M:%S.%f")[:-3] + "+00:00"
            except ValueError as e:
                #print(f"Error parsing datetime: {e}")
                return None

        @staticmethod
        def canonical_page_url_key(url_raw):
            """
            Mesma página com query/fragment diferente conta como uma chave só
            (útil quando o mitm registra redirects/tracking parecidos).
            """
            if not url_raw:
                return ""
            raw = str(url_raw).strip().lower()
            if not raw.startswith(("http://", "https://")):
                raw = "https://" + raw.lstrip("/")
            p = urlparse(raw)
            host = (p.netloc or "").lower()
            if host.startswith("www."):
                host = host[4:]
            path = (p.path or "/").rstrip("/") or "/"
            return urlunparse(("https", host, path, "", "", ""))

        def __init__(self, squid_log_file_path=None, position_file_path=None):
            self.squid_log_file_path = squid_log_file_path or os.getenv('LOGS_FILE_PATH', '/root/logs.txt')
            self.position_file_path = position_file_path or os.getenv('ARM_FILE_PATH', '/root/arm.txt')
            self.processed_lines = set()
            self.inflight_page_keys = set()
            self.pending_line_by_page = {}
            self.inflight_lock = threading.Lock()
            self.read_processed_urls()  # Carrega as URLs processadas ao iniciar
            print("MonitorLog inicializado com sucesso.")

        def log_verification_summary(self, url, result):
            """
            Loga o resumo após a verificação da página:
            - número de sentenças ofensivas
            - cada sentença no formato: sentence - score - class
            """
            payload = result or {}
            offensive_sentences = payload.get("offensive_sentences") or []
            total = len(offensive_sentences)
            print(f"[VERIFY] url={url} | offensive_sentences={total}")
            for item in offensive_sentences:
                sentence = str(item.get("sentence") or "").strip()
                score = item.get("score")
                cls = item.get("class") or item.get("label") or "Unknown"
                score_fmt = f"{float(score):.6f}" if isinstance(score, (int, float)) else str(score)
                print(f"{sentence} - {score_fmt} - {cls}")

        def read_processed_urls(self):
            """Lê as URLs já processadas do arquivo arm.txt."""
            if os.path.exists(self.position_file_path):
                with open(self.position_file_path, 'r') as file:
                    for line in file:
                        self.processed_lines.add(line.strip())
            #print("URLs previamente processadas carregadas.")

        def tail_file(self):
            #print("Método para ler o arquivo de log continuamente.")
            try:
                with open(self.squid_log_file_path, 'r') as file:
                    #print(f"Arquivo {self.squid_log_file_path} aberto para monitoramento.")
                    file.seek(0, os.SEEK_END)  # Move para o final do arquivo
                    
                    while True:
                        line = file.readline()
                        
                        if not line:  # Se não há uma nova linha, espera um pouco
                            time.sleep(0.1)
                            continue
                        
                        line_raw = line.strip()
                        if not line_raw:
                            continue
                        if line_raw in self.processed_lines:
                            continue
                        self.processed_lines.add(line_raw)

                        url_from_line = dado.extract_site_from_log_line(line)
                        page_key = self.canonical_page_url_key(url_from_line) if url_from_line else ""
                        if page_key:
                            with self.inflight_lock:
                                if page_key in self.inflight_page_keys:
                                    # Guarda a linha mais recente para essa página.
                                    # Quando o processamento atual terminar, ela será
                                    # reprocessada com o nav_id mais novo.
                                    self.pending_line_by_page[page_key] = line
                                    print(f"[SKIP] Página já em processamento: {page_key}")
                                    continue
                                self.inflight_page_keys.add(page_key)

                        threading.Thread(
                            target=self._process_line_with_release,
                            args=(line, page_key),
                            daemon=True,
                        ).start()
            except Exception as e:
                print(f"Erro ao monitorar o arquivo de log: {e}")

        def _process_line_with_release(self, line, page_key):
            next_line = None
            try:
                self.process_line(line)
            finally:
                if page_key:
                    with self.inflight_lock:
                        self.inflight_page_keys.discard(page_key)
                        next_line = self.pending_line_by_page.pop(page_key, None)
                        if next_line:
                            self.inflight_page_keys.add(page_key)
                    if next_line:
                        print(f"[RETRY] Reprocessando página com nav mais recente: {page_key}")
                        threading.Thread(
                            target=self._process_line_with_release,
                            args=(next_line, page_key),
                            daemon=True,
                        ).start()

        def process_line(self, line):
            with semaforo:
                #print("Iniciando processamento da linha de log.")
                
                # Verifica se a linha termina com .com:443 ou contém um domínio válido com .com ou extensões similares
                if not re.search(r'\.[a-z](\.[a-z]{2,3})?(:\d+)?', line.strip(), re.IGNORECASE):
                    #print(f"Linha ignorada, não segue o padrão esperado: {line.strip()}")
                    return  # Ignora a linha e sai da função

                url = dado.extract_site_from_log_line(line)
                if url:
                    #print(f"URL extraída: {url}")
                    url_site = url if url.startswith("http") else f"http://{url}"
                    url_site = url_site.replace(":433", "")
                    url_site = url_site.replace(":http://", "")
                    url_site = url_site.replace("http://", "").replace("https://", "")
                    
                    # Adiciona validação para excluir domínios indesejados
                    excluded_domains = [
                        'googlesyndication.com',
                        'google-analytics.com',
                        'doubleclick.net',
                        'google.com',
                        'gstatic.com',
                        'googleapis.com'
                    ]
                    
                    if any(domain in url_site for domain in excluded_domains):
                        #print(f"URL ignorada por ser de um domínio excluído: {url_site}")
                        return
                        
                    site = url_site
                    #print(f"O site é {site}")# Remove o protocolo
                    
                    ip_maquina = dado.extract_ip_from_log_line(line)
                    nav_id = dado.extract_nav_id_from_log_line(line)
                    data_linha = dado.extract_date_from_log_line(line)
                    hora_linha = dado.extract_time_from_log_line(line)
                    if data_linha is None or hora_linha is None:
                        #print(f"Erro: data ou hora inválida na linha: {line.strip()}")
                        return  # Ignora o processamento da linha
                    
                    data_hora = self.format_datetime(data_linha, hora_linha)
                    #print(f"Dados extraídos -> URL: {dado.url}, IP: {dado.ip_maquina}, Data/Hora: {dado.data_hora}")

                    # --- Pré-Playwright: frases ofensivas já no DB → highlight + gate imediato ---
                    indexed_site = idx.buscar_site_por_url(url_site.strip())
                    frases_existentes = (indexed_site or {}).get("frases") or []

                    frases_db_ofensivas = []
                    motivos_db_ofensivos = []
                    motivos_db_set = set()
                    for frase_item in frases_existentes:
                        if isinstance(frase_item, str):
                            texto = frase_item.strip()
                            if texto:
                                frases_db_ofensivas.append(texto)
                        elif isinstance(frase_item, dict):
                            texto = str(frase_item.get("texto") or "").strip()
                            if texto and bool(frase_item.get("ofensiva", True)):
                                frases_db_ofensivas.append(texto)
                                motivo_item = (
                                    frase_item.get("categoria")
                                    or frase_item.get("motivo")
                                    or frase_item.get("label")
                                )
                                if motivo_item:
                                    motivo_norm = str(motivo_item).strip()
                                    if motivo_norm and motivo_norm not in motivos_db_set:
                                        motivos_db_set.add(motivo_norm)
                                        motivos_db_ofensivos.append(motivo_norm)

                    frases_db_ofensivas = list(dict.fromkeys(frases_db_ofensivas))

                    gate_released_early = False
                    if nav_id and frases_db_ofensivas:
                        print(
                            f"[SSE] pré-Playwright (DB): nav_id={nav_id} | "
                            f"{len(frases_db_ofensivas)} frase(s) | url={url_site}"
                        )
                        if bloqueio.notificar_highlight_nav(
                            nav_id, frases_db_ofensivas, motivos_db_ofensivos
                        ):
                            if bloqueio.notificar_verificacao_nav(nav_id, True):
                                gate_released_early = True
                                print("[SSE] VERIFY_GATE liberado (frases conhecidas no DB).")
                            else:
                                print(
                                    "[SSE] Highlight OK mas falha em /send-status-to-nav — "
                                    "gate pode permanecer ativo."
                                )
                        else:
                            print(
                                "[SSE] Frases do DB não entregues (POST /send-to-nav) — "
                                "VERIFY_GATE aguarda fim da IA com sucesso no envio."
                            )

                    # Verifica se a URL já foi processada
                    # if dado.url not in self.processed_lines:
                        # if not idx.is_site_indexed(dado.url):
                            
                    #print(f"URL não indexada previamente. Iniciando indexação de {dado.url}")
                    html = dado.extract_html(url_site) or ""
                            
                    clean_html = dado.remove_html_tags(html)
                    #print("HTML limpo de tags para armazenamento local.")
                    #print(f"\n\n~~~~~~~~~~~~\n{clean_html}\n\n~~~~~~~~~~\n\n")

                            # Tirando os caracteres que podem causar problemas no nome do arquivo
                            # hash_nome = hashlib.md5(dado.url.encode()).hexdigest()
                    nome_arquivo = filename_from_url(url_site, unique_len=16)
                            # Lugar para salvar os HTMLs
                    diretorio_html = os.getenv('HTML_DUMPS_DIR')
                            
                            #pra linux
                            # caminho_html = os.path.normpath(os.path.join(diretorio_html, f"{nome_arquivo}"))
                            #pra windows
                    caminho_html = os.path.join(diretorio_html, f"{nome_arquivo}").replace('\\','/')
                            #ATENÇÃO! remover o .replace da linha acima no linux, e fazer o mesmo em bloqueio
                            
                            # Se não tiver a pasta, ele cria
                    if not os.path.exists(diretorio_html):
                        os.makedirs(diretorio_html)
                            
                    payload_bytes = f"<urlDoSite>{url_site}</urlDoSite>\n{clean_html}".encode('utf-8')
                    encrypt_and_atomic_write(caminho_html, payload_bytes)
                            
                    #print(f"Arquivo criptografado salvo em: {caminho_html}")
                            
                            # Escreve o HTML no arquivo
                            # with open(caminho_html, 'w', encoding='utf-8') as f:
                            #     f.write(f"<urlDoSite>{dado.url}</urlDoSite>\n{clean_html}")
                                
                    #print(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ caminho:{caminho_html}")
                           
                    dado.append_site_to_arm_file(self.position_file_path, site)
                    self.processed_lines.add(site)  # Marca a URL como processada
                    #print(f"URL adicionada ao arquivo de controle: {self.position_file_path}")

                            # Converte a string de data/hora para um objeto datetime
                    data_hora_obj = datetime.strptime(data_hora.split('.')[0], "%d-%m-%YT%H:%M:%S")
                            
                            
                    #print(f"Dados indexados com sucesso no MongoDB para a URL {dado.url}")
                    # indexação / frases_existentes já carregados antes do Playwright (pré-DB gate).

                    # Roda a IA para encontrar frases da página atual.
                    result = bloqueio.bloquear_sites(nome_arquivo) or {}
                    self.log_verification_summary(url_site, result)
                    frases_sse = result.get("frases") or []
                    if isinstance(frases_sse, str):
                        frases_sse = [frases_sse]
                    frases_sse = [f for f in frases_sse if f]

                    frases_map = {}
                    for frase_item in frases_existentes:
                        if isinstance(frase_item, str):
                            texto = frase_item.strip()
                            if texto:
                                frases_map[texto] = {
                                    "texto": texto,
                                    "ofensiva": True,
                                    "categoria": None,
                                    "motivo": None,
                                    "label": None,
                                    "score": None,
                                }
                        elif isinstance(frase_item, dict):
                            texto = str(frase_item.get("texto") or "").strip()
                            if texto:
                                frases_map[texto] = {
                                    "texto": texto,
                                    "ofensiva": bool(frase_item.get("ofensiva", True)),
                                    "categoria": (
                                        frase_item.get("categoria")
                                        or frase_item.get("motivo")
                                        or frase_item.get("label")
                                    ),
                                    "motivo": frase_item.get("motivo") or frase_item.get("label"),
                                    "label": frase_item.get("label") or frase_item.get("motivo"),
                                    "score": frase_item.get("score"),
                                }

                    offensive_details = result.get("offensive_sentences") or []
                    details_by_sentence = {}
                    for item in offensive_details:
                        texto = str(item.get("sentence") or "").strip()
                        if not texto:
                            continue
                        details_by_sentence[texto] = {
                            "categoria": item.get("class") or item.get("label"),
                            "motivo": item.get("class") or item.get("label"),
                            "label": item.get("class") or item.get("label"),
                            "score": item.get("score"),
                        }

                    for frase in frases_sse:
                        texto = str(frase).strip()
                        if not texto:
                            continue
                        atual = frases_map.get(texto, {})
                        ofensiva_atual = atual.get("ofensiva", True)
                        detalhe = details_by_sentence.get(texto, {})
                        frases_map[texto] = {
                            "texto": texto,
                            "ofensiva": bool(ofensiva_atual),
                            "categoria": detalhe.get("categoria") or atual.get("categoria") or atual.get("motivo"),
                            "motivo": detalhe.get("motivo") or atual.get("motivo"),
                            "label": detalhe.get("label") or atual.get("label"),
                            "score": detalhe.get("score") if isinstance(detalhe.get("score"), (int, float)) else atual.get("score"),
                        }

                    frases_persist = list(frases_map.values())
                    # Envia para SSE todas as frases ofensivas persistidas (inclusive as já
                    # cadastradas no banco e não detectadas pela IA nesta execução).
                    frases_sse_ativas = [
                        item["texto"]
                        for item in frases_persist
                        if item.get("ofensiva") and item.get("texto")
                    ]

                    motivos_sse = result.get("motivos") or []
                    if isinstance(motivos_sse, str):
                        motivos_sse = [motivos_sse]
                    if not motivos_sse and result.get("motivo"):
                        motivos_sse = [result.get("motivo")]
                    motivos_sse = [m for m in motivos_sse if m]

                    # VERIFY_GATE: só libera após (1) página limpa confirmada + POST status OK, ou
                    # (2) POST /send-to-nav com frases ofensivas OK + POST status OK.
                    # Se já liberamos no pré-Playwright (DB), reenvia highlight consolidado se houver frases
                    # novas da IA; não repete /send-status-to-nav para não duplicar evento.
                    if not nav_id:
                        if frases_sse_ativas:
                            print(
                                "[SSE] frases ofensivas encontradas mas nav_id ausente na linha de log — "
                                "POST /send-to-nav não será enviado (mitm precisa emitir UUID no fim da linha)."
                            )
                    elif gate_released_early:
                        if frases_sse_ativas:
                            print(
                                f"[SSE] pós-IA: atualizando highlight consolidado | "
                                f"{len(frases_sse_ativas)} frase(s) | url={url_site}"
                            )
                            bloqueio.notificar_highlight_nav(
                                nav_id, frases_sse_ativas, motivos_sse
                            )
                        print(
                            f"[SSE] gate já liberado no pré-Playwright | nav_id={nav_id} | url={url_site}"
                        )
                    elif not frases_sse_ativas:
                        print(
                            "[SSE] nenhuma frase ofensiva (IA) — liberando VERIFY_GATE (página limpa)."
                        )
                        if bloqueio.notificar_verificacao_nav(nav_id, False):
                            print(
                                f"[SSE] status verificação (gate): nav_id={nav_id} | "
                                f"bloqueado=False | url={url_site}"
                            )
                        else:
                            print(
                                f"[SSE] VERIFY_GATE pode permanecer: falha em /send-status-to-nav | "
                                f"nav_id={nav_id}"
                            )
                    else:
                        print(
                            f"[SSE] envio final (IA+DB): nav_id={nav_id} | "
                            f"{len(frases_sse_ativas)} frase(s) | url={url_site}"
                        )
                        if bloqueio.notificar_highlight_nav(
                            nav_id, frases_sse_ativas, motivos_sse
                        ):
                            if bloqueio.notificar_verificacao_nav(nav_id, True):
                                print(
                                    f"[SSE] status verificação (gate): nav_id={nav_id} | "
                                    f"bloqueado=True | url={url_site}"
                                )
                            else:
                                print(
                                    f"[SSE] Highlight OK mas falha em /send-status-to-nav | nav_id={nav_id}"
                                )
                        else:
                            print(
                                "[SSE] VERIFY_GATE NÃO liberado: falha ao enviar frases ofensivas "
                                "(POST /send-to-nav)."
                            )

                    # #print(dado.url.strip())
                    # #print(idx.is_site_indexed(dado.url.strip()))
                    # #print(idx.is_site_indexed("cooktest60.vercel.app"))
                    # #print(idx.buscar_site_por_url(dado.url.strip()))
                    # #print(idx.buscar_site_por_url("cooktest60.vercel.app"))
                    if not indexed_site:
                        #print("RESULTADO::::", result)
                        #print("FLAG::::",result.get("bloquear"))
                        idx.indexar_site({
                            "PathLocal": caminho_html,
                            "urlWeb": url_site,
                            "dataHora": data_hora_obj,  # Envia como objeto datetime
                            "flag": bool(result.get("bloquear")),
                            "ipMaquina": ip_maquina,
                            "tipoInsercao": "Automatico",
                            "motivo": result.get("motivo", "N/A"),
                            "frases": frases_persist,
                            "navId": nav_id,
                        })
                        #print("o nome do arquivo é ", nome_arquivo)
                    else:
                        #print(f"URL {dado.url} já indexada. Re-verificando e salvando como acesso.")
                        idx.atualizar_indexacao(
                            urlWeb=url_site.strip(),
                            dados_atualizados={
                                "PathLocal": caminho_html,
                                "flag": any(item.get("ofensiva") for item in frases_persist),
                                "motivo": result.get("motivo", "N/A"),
                                "frases": frases_persist,
                                "urlWeb": url_site,
                            }
                        )

                        indexed_site = idx.buscar_site_por_url(url_site.strip())  # Recarrega após atualizar.
                        if indexed_site:
                            flag = indexed_site.get('flag', None)  # Obter a flag do site indexado
                        else:
                            flag = "false"  # Se não encontrar, assume flag como false

                                
                        acesso_doc = {
                            "ipMaquina": ip_maquina,
                            "urlWeb": url_site,
                            "dataHora": data_hora,
                            "flag": flag,
                        }
                        if nav_id:
                            acesso_doc["navId"] = nav_id
                        acc.registrar_acesso(acesso_doc)
                        #print(f"Acesso salvo com sucesso no MongoDB para a URL {dado.url}")
                    # else:
                        # #print(f"URL {dado.url} já processada anteriormente. Ignorando.")
                else:
                    print("Nenhuma URL válida encontrada na linha de log.")

    def check_required_files():
        required_files = [
            os.getenv('LOGS_FILE_PATH', '/root/logs.txt'),
            os.getenv('ARM_FILE_PATH', '/root/arm.txt'),
        ]
        for file_path in required_files:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    pass
                #print(f"Arquivo criado: {file_path}")


    def login_and_get_token():
        """Logs into the API and sets the auth token as an environment variable."""
        api_base_url = os.getenv('API_URL', 'http://localhost:4000/api')
        login_url = f"{api_base_url}/login"
        email = os.getenv('SYSTEM_EMAIL')
        password = os.getenv('SYSTEM_PASSWORD')

        if not email or not password:
            #print("Erro: SYSTEM_EMAIL e SYSTEM_PASSWORD devem ser definidos no ambiente.")
            return False

        try:
            #print("Tentando fazer login na API para obter o token...")
            response = requests.post(login_url, json={"email": email, "senha": password})
            response.raise_for_status()  # Lança exceção para status de erro (4xx/5xx)
            
            token = response.json().get('token')
            if token:
                os.environ['API_TOKEN'] = token
                #print("Login bem-sucedido. Token de autenticação obtido e configurado.")
                return True
            else:
                #print("Erro: Token não encontrado na resposta da API.")
                return False
        except requests.exceptions.RequestException as e:
            #print(f"Erro ao fazer login na API: {e}")
            return False

    def main():
        check_required_files()
        if login_and_get_token():
            squid_log_file_path = os.getenv('LOGS_FILE_PATH', '/root/logs.txt')
            position_file_path = os.getenv('ARM_FILE_PATH', '/root/arm.txt')
            #print("Inicializando monitor de log...")
            monitor = MonitorLog(squid_log_file_path, position_file_path)
            monitor.tail_file()
        else:
            print("Encerrando o programa devido a falha no login da API.")

    if __name__ == "__main__":
        #print("Iniciando o script principal...")
        main()
else:
    print("Encerrando o programa devido a erro na conexão com o banco de dados.")

    #sudo systemctl restart mitmproxy.service

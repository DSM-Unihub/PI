import re
import os
from datetime import datetime
import requests
import hmac
import json
import hashlib
import time
from typing import List, Optional
# no topo de bloqueio.py
from crypto_utils import decrypt_from_file

from dotenv import load_dotenv

load_dotenv()


class Bloqueio:
    def __init__(self, arm_file_path, html_directory):
        self.arm_file_path = arm_file_path
        self.html_directory = html_directory
        self._resist_api_token = None
        self.secret_key = os.getenv('API_SECRET_KEY')
        base = os.getenv("MODEL_API_BASE", "http://127.0.0.1:5000").strip().rstrip("/")
        self.model_api_verificar_url = f"{base}/verificar"
        self.model_api_batch_url = f"{base}/verificar-batch"
        self.model_batch_chunk = max(1, int(os.getenv("MODEL_BATCH_CHUNK", "8")))
        self.model_batch_timeout = int(os.getenv("MODEL_BATCH_TIMEOUT_SEC", "120"))
        
    @staticmethod
    def _sse_candidate_bases():
        primary = os.getenv("SSE_BASE_URL", "https://ssenovo-production.up.railway.app").rstrip("/")
        fallback = os.getenv("SSE_FALLBACK_BASE_URL", "http://127.0.0.1:8001").rstrip("/")
        bases = [primary]
        if fallback and fallback != primary:
            bases.append(fallback)
        return bases

    def ler_arm_file(self):
        """Lê o arquivo arm.txt e retorna uma lista de URLs."""
        with open(self.arm_file_path, 'r') as file:
            return [line.strip() for line in file]

    def extrair_url_do_arquivo(self, caminho_arquivo):
        """Extrai a URL do site a partir do conteúdo do arquivo, removendo as tags <urlDoSite>."""
        try:
            data = decrypt_from_file(caminho_arquivo)
            conteudo = data.decode("utf-8", errors="replace")
            tag_inicio = '<urlDoSite>'
            tag_fim = '</urlDoSite>'
            inicio = conteudo.find(tag_inicio)
            fim = conteudo.find(tag_fim)
            if inicio != -1 and fim != -1:
                url = conteudo[inicio + len(tag_inicio):fim]
                return url.strip()
             # fallback: se não achar a tag, tenta extrair por regex ou retorna todo o conteúdo do início
            return None
        except Exception as e:
            print(f"Erro ao extrair URL do arquivo (descriptografia falhou?): {e}")
        
        return None

    def _url_is_imageboard(self, url: Optional[str]) -> bool:
        """8kun / 4chan family — plaintext agrega capcode + corpo + disclaimer."""
        if not url:
            return False
        u = url.lower()
        needles = (
            "8kun.",
            "8ch.net",
            "8ch.moe",
            "4chan.org",
            "4channel.org",
            "boards.4chan.org",
            "boards.4channel.org",
        )
        return any(n in u for n in needles)

    def _preprocess_imageboard_aggregate(self, texto: str) -> str:
        """
        Evita uma única 'frase' com (OP) + post + Disclaimer colados como no get_text().
        """
        if not texto:
            return texto
        # Disclaimer colado ao fim do post (sem quebra de linha)
        texto = re.sub(r"([^\n])\s*(Disclaimer:)", r"\1\n\2", texto, flags=re.IGNORECASE)
        # Capcodes comuns colados ao texto do post
        texto = re.sub(r"\(OP\)\s*", "", texto, flags=re.IGNORECASE)
        texto = re.sub(r"\[OP\]\s*", "", texto, flags=re.IGNORECASE)
        texto = re.sub(r"\(ST\)\s*", "", texto, flags=re.IGNORECASE)
        return texto

    _CHAN_POST_HEADER = re.compile(
        r"^\s*"
        r"(?:[a-f0-9]{5,10}\s*(?:\(\d+\)\s*)?No\.\d+|"  # 59e807 No.82 / aa09ee (1) No.4546
        r"\(\d+\)\s*No\.\d+)"  # (1) No.4546 sem id hex na frente
        r"\s*",
        re.IGNORECASE,
    )

    def _strip_chan_post_headers(self, s: str) -> str:
        """Remove prefixos de post (id hex + No.####) colados ao texto pelo get_text()."""
        prev = None
        guard = 0
        while prev != s and guard < 8:
            prev = s
            s = self._CHAN_POST_HEADER.sub("", s)
            guard += 1
        return s

    def _sanitize_chan_sentence(self, s: str) -> str:
        """Remove trechos de boilerplate que ainda tenham ficado na mesma sentença."""
        s = re.split(r"\s+Disclaimer:\s?", s, maxsplit=1, flags=re.IGNORECASE)[0]
        s = re.sub(r"^\s*\(OP\)\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"^\s*\[OP\]\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"^\s*\(ST\)\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"^\s*▶+\s*", "", s)
        s = re.sub(r">>+\d*\s*$", "", s)
        s = re.sub(r"^\s*No\.\d+\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"^\s*File:\s*", "", s, flags=re.IGNORECASE)
        s = re.sub(r"\[Post a Reply\].*$", "", s, flags=re.IGNORECASE)
        s = re.sub(r"\[Advertise on 4chan\].*$", "", s, flags=re.IGNORECASE)
        s = re.sub(r"\[Disable Mobile View.*$", "", s, flags=re.IGNORECASE)
        s = re.sub(r"\[Enable Mobile View.*$", "", s, flags=re.IGNORECASE)
        s = self._strip_chan_post_headers(s)
        return re.sub(r"\s+", " ", s).strip()

    def _looks_like_url_or_path_noise(self, s: str) -> bool:
        f = (s or "").strip()
        if not f:
            return True
        # Sobras de marcação/meta e links curtos sem semântica textual.
        if "<urldosite>" in f.lower() or "</urldosite>" in f.lower():
            return True
        if re.search(r"^https?://", f, re.IGNORECASE):
            return True
        if re.search(r"^[\w.-]+\.[a-z]{2,}(?:[\/?#].*)?$", f, re.IGNORECASE):
            return True
        if ("/" in f or "?" in f or "&" in f) and len(re.findall(r"[A-Za-zÀ-ÿ]{2,}", f)) <= 3:
            return True
        # Filename/título técnico isolado (ex: Hydrogen_Density_Plots.)
        if "_" in f and " " not in f and len(re.findall(r"[A-Za-z]{2,}", f)) >= 2:
            return True
        return False

    def segmentar_texto(self, conteudo: str, url: Optional[str] = None):
        texto = (conteudo or "").replace("\xa0", " ")
        chan_board = self._url_is_imageboard(url)
        if chan_board:
            texto = self._preprocess_imageboard_aggregate(texto)

        # Normalize spaces
        texto = re.sub(r"[ \t\r\f\v]+", " ", texto)

        # 🔥 IMPORTANT: force splits for chan-style content
        texto = re.sub(r"\n?\s*Anonymous.*?\d{2}:\d{2}:\d{2}", "\n", texto)
        texto = re.sub(r">>\d+", "\n", texto)

        # Sentence spacing
        texto = re.sub(r'([.!?])([A-Za-zÀ-ÿ])', r'\1 \2', texto)

        # Break weird UI junk
        texto = re.sub(r"(?:\s\|\s|(?:\s---\s)|(?:\.\.\.))", "\n", texto)

        # Normalize newlines
        texto = re.sub(r"\n{2,}", "\n", texto).strip()

        noise_regex = [
            r"^\[.*\]$",
            r"^File \(hide\):",
            r"^\s*▶\s*Anonymous",
            r"\[Open Thread\]|\[Watch Thread\]|\[Show All Posts\]",
            r"^\s*Disclaimer:",
            r"^\s*Catalog\s+Nerve Center\s+Random",
        ]
        if chan_board:
            noise_regex = noise_regex + [
                r"^\s*\(OP\)\s*$",
                r"^\s*\[OP\]\s*$",
                r"^\s*\(ST\)\s*$",
                r"^\s*OP\s*$",
                # só metadado de post (id + No.####), sem texto de corpo
                r"^\s*[a-f0-9]{5,10}\s*(?:\(\d+\)\s*)?No\.\d+\s*$",
                r"^\s*\(\d+\)\s*No\.\d+\s*$",
                r"^\s*No\.\d+\s*$",
                r"^\s*File:\s*.*$",
                r"^\s*Delete Post:\s*.*$",
                r"^\s*Style:\s*.*$",
                r"^\s*Post a Reply.*$",
                r"^\s*Return\s+Catalog\s+Top.*$",
                r"^\s*Refresh\s*\[Advertise on 4chan\].*$",
                r"^\s*\[[^\]]+\]\s*\[[^\]]+\].*$",
                r"^\s*All trademarks and copyrights.*$",
                r"^\s*Images uploaded are the responsibility.*$",
            ]

        def _is_noise(frase: str) -> bool:
            f = frase.strip()
            if not f:
                return True
            for padrao in noise_regex:
                if re.search(padrao, f, re.IGNORECASE):
                    return True
            if self._looks_like_url_or_path_noise(f):
                return True
            if chan_board:
                # Linhas de UI/menu tendem a ter muitos tokens entre colchetes.
                if len(re.findall(r"\[[^\]]+\]", f)) >= 3:
                    return True
                # Menus copiados costumam ter proporção muito alta de símbolos.
                symbol_count = len(re.findall(r"[\/\[\]\(\)\|]", f))
                if symbol_count >= 12:
                    return True
                # Frases longas com pouquíssimas palavras reais (ex.: blocos de navegação)
                words = re.findall(r"[A-Za-zÀ-ÿ]{2,}", f)
                if len(f) > 120 and len(words) < 12:
                    return True
            return False

        frases_finais = []
        linhas = [l.strip() for l in texto.split("\n") if l.strip()]

        for linha in linhas:
            sentencas = re.split(r'(?<=[.!?])\s+', linha)

            for sentenca in sentencas:
                s = re.sub(r"\s+", " ", sentenca.strip())
                if chan_board:
                    s = self._sanitize_chan_sentence(s)
                if not s:
                    continue

                if _is_noise(s):
                    continue

                frases_finais.append(s)

        # ✅ Dedupe + better filter
        unicas = []
        visto = set()

        for frase in frases_finais:
            chave = frase.strip()

            # 🔥 FIX: allow shorter meaningful sentences
            if len(chave) < 10:
                continue

            if chave in visto:
                continue

            visto.add(chave)
            unicas.append(chave)

        return unicas


    def enviar_para_modelo(self, frase: str):
        """
        Envia uma frase para o modelo de verificação de preconceito.
        Retorna a lista de classificações (label + score).
        """
        payload = {"texto": frase}
        json_data = json.dumps(payload)
        timestamp = str(int(time.time()))

        message = f"{timestamp}:{json_data}"
        auth_token = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()

        # Headers com autenticação
        headers = {
            'Content-Type': 'application/json',
            'X-Auth-Token': auth_token,
            'X-Timestamp': timestamp
        }

        print("----")
        try:
            response = requests.post(self.model_api_verificar_url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 401:
                print("[ERRO] Falha na autenticação com o endpoint")
                return []
            
            response.raise_for_status()  # dispara erro se não for 200
            return response.json()  # deve ser a lista de {label, score}
        except requests.exceptions.RequestException as e:
            print(f"[ERRO] Falha ao conectar ao modelo: {e}")
            return []

    def enviar_para_modelo_batch(self, frases_chunk: List[str]):
        """
        Envia até MODEL_BATCH_CHUNK sentenças em uma única inference (iaapi /verificar-batch).
        Retorna lista paralela ao chunk; None se falhar (usa fallback item a item na caller).
        """
        if not frases_chunk:
            return []
        payload = {"textos": frases_chunk}
        json_data = json.dumps(payload, ensure_ascii=False)
        timestamp = str(int(time.time()))
        message = f"{timestamp}:{json_data}"

        auth_token = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256,
        ).hexdigest()
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            "X-Auth-Token": auth_token,
            "X-Timestamp": timestamp,
        }
        preview = [(f[:64] + "…") if len(f) > 64 else f for f in frases_chunk[:3]]
        print(
            "----",
            f"[IA batch req] n={len(frases_chunk)} preview={preview!r}",
        )
        try:
            response = requests.post(
                self.model_api_batch_url,
                data=json_data.encode("utf-8"),
                headers=headers,
                timeout=self.model_batch_timeout,
            )
            if response.status_code == 401:
                print("[ERRO] Falha na autenticação com /verificar-batch")
                return None
            response.raise_for_status()
            data = response.json()
            resultado = data.get("resultados")
            if not isinstance(resultado, list):
                print("[IA batch res] formato inválido: sem 'resultados' lista")
                return None
            if len(resultado) != len(frases_chunk):
                print(
                    f"[IA batch res] mismatch tamanhos: {len(resultado)} vs {len(frases_chunk)}"
                )
                return None
            return resultado
        except requests.exceptions.RequestException as e:
            print(f"[ERRO] Falha ao batch no modelo: {e}")
            return None

    def verificar_html(self, hash_nome):
        """
        Verifica se há conteúdo preconceituoso no arquivo HTML correspondente.
        Retorna um dicionário com status e detalhes.
        """
        # pra linux
        # caminho_html = os.path.join(self.html_directory, f"{hash_nome}.txt") 
        # pra windows
        # caminho_html = os.path.join(self.html_directory, f"{hash_nome}.txt").replace('\\','/')
        caminho_html = os.path.join(self.html_directory, f"{hash_nome}.enc").replace('\\','/')
        if os.path.exists(caminho_html):
            url = self.extrair_url_do_arquivo(caminho_html)
            print(caminho_html)
            print(url)
            if not url:
                return {
                    "bloquear": False,
                    "motivo": "Nao existe",
                    "frase": None,
                    "frases": [],
                    "offensive_sentences": [],
                }
                
            try:
                conteudo_bytes = decrypt_from_file(caminho_html)
                conteudo = conteudo_bytes.decode("utf-8", errors="replace")
                conteudo = re.sub(
                    r"<urlDoSite>.*?</urlDoSite>\s*",
                    "",
                    conteudo,
                    count=1,
                    flags=re.IGNORECASE | re.DOTALL,
                )
            except Exception as e:
                print(f"Erro ao descriptografar o arquivo {caminho_html}: {e}")
                return {
                    "bloquear": False,
                    "motivo": "Descriptografia falhou",
                    "frase": None,
                    "frases": [],
                    "offensive_sentences": [],
                }
            
            frases = self.segmentar_texto(conteudo, url)
            hits = []

            def aplicar_um_resultado(frase: str, resultados):
                """resultados = lista de {label, score} igual /verificar."""
                if not resultados:
                    return
                melhor = max(resultados, key=lambda r: r["score"])
                if melhor["label"] != "Appropriate" and melhor["score"] > 0.5:
                    hits.append(
                        {
                            "frase": frase.strip(),
                            "label": melhor["label"],
                            "score": melhor["score"],
                            "class": melhor["label"],
                        }
                    )

            chunk_size = self.model_batch_chunk
            offset = 0
            while offset < len(frases):
                chunk = frases[offset : offset + chunk_size]
                offset += chunk_size

                batched = self.enviar_para_modelo_batch(chunk)

                if batched is None:
                    print("[IA batch] fallback sequencial neste chunk")
                    for idx, frase in enumerate(chunk):
                        print(f" - frase (seq) [{idx}]: '{frase[:120]}...'" if len(frase) > 120 else f" - frase (seq) [{idx}]: '{frase}'")
                        aplicar_um_resultado(frase, self.enviar_para_modelo(frase))
                    continue

                for idx, frase in enumerate(chunk):
                    print(f" - frase (batch) [{idx}]: '{frase[:120]}…'" if len(frase) > 120 else f" - frase (batch) [{idx}]: '{frase}'")
                    aplicar_um_resultado(frase, batched[idx])

            if not hits:
                return {
                    "bloquear": False,
                    "motivo": None,
                    "frase": None,
                    "frases": [],
                    "offensive_sentences": [],
                }

            worst = max(hits, key=lambda h: h["score"])
            ordem = []
            visto = set()
            for h in hits:
                t = h["frase"]
                if t not in visto:
                    visto.add(t)
                    ordem.append(t)

            motivos = []
            vistos_motivo = set()
            for h in hits:
                label = h.get("label")
                if label and label not in vistos_motivo:
                    vistos_motivo.add(label)
                    motivos.append(label)

            return {
                "bloquear": True,
                "motivo": worst["label"],
                "motivos": motivos,
                "score": worst["score"],
                "frase": worst["frase"],
                "frases": ordem,
                "offensive_sentences": [
                    {
                        "sentence": h["frase"],
                        "score": h["score"],
                        "class": h["label"],
                    }
                    for h in hits
                ],
            }
        else:
            print("Arquivo não encontrado", caminho_html)
        return {
            "bloquear": False,
            "motivo": None,
            "frase": None,
            "frases": [],
            "offensive_sentences": [],
        }


    def _bloqueio_resist_api_base(self):
        return os.getenv("API_URL", "http://localhost:4000/api").rstrip("/")

    def _bloqueio_resist_api_login(self):
        env_token = (os.getenv("API_TOKEN") or "").strip()
        if env_token:
            self._resist_api_token = env_token
            return True
        if self._resist_api_token:
            return True
        email = (os.getenv("SYSTEM_EMAIL") or "").strip()
        password = (os.getenv("SYSTEM_PASSWORD") or "").strip()
        if not email or not password:
            print("SYSTEM_EMAIL e SYSTEM_PASSWORD são obrigatórios para a API de bloqueados.")
            return False
        try:
            response = requests.post(
                f"{self._bloqueio_resist_api_base()}/login",
                json={"email": email, "senha": password},
                timeout=15,
            )
            response.raise_for_status()
            token = response.json().get("token")
            if not token:
                print("Login na API OK, mas token ausente na resposta.")
                return False
            self._resist_api_token = token
            return True
        except requests.RequestException as exc:
            print(f"Erro ao fazer login na API de bloqueados: {exc}")
            return False

    def _bloqueio_resist_api_headers(self):
        if not self._bloqueio_resist_api_login():
            return None
        return {"Authorization": f"Bearer {self._resist_api_token}"}

    @staticmethod
    def _normalize_url_bloqueio(url):
        url_bloqueio = (
            str(url or "")
            .replace("<urlDoSite>", "")
            .replace("</urlDoSite>", "")
            .strip()
        )
        url_bloqueio = url_bloqueio.replace(":443", "")
        url_bloqueio = re.sub(r"^https?://", "", url_bloqueio, flags=re.IGNORECASE)
        return url_bloqueio.strip().lower()

    def url_ja_bloqueada(self, url):
        """Verifica se a URL já está na lista bloqueados da API."""
        url_bloqueio = self._normalize_url_bloqueio(url)
        if not url_bloqueio:
            return False
        headers = self._bloqueio_resist_api_headers()
        if not headers:
            return False
        try:
            response = requests.get(
                f"{self._bloqueio_resist_api_base()}/listas/bloqueados/entrada",
                params={"url": url_bloqueio},
                headers=headers,
                timeout=10,
            )
            if response.status_code == 401:
                self._resist_api_token = None
                headers = self._bloqueio_resist_api_headers()
                if not headers:
                    return False
                response = requests.get(
                    f"{self._bloqueio_resist_api_base()}/listas/bloqueados/entrada",
                    params={"url": url_bloqueio},
                    headers=headers,
                    timeout=10,
                )
            return response.status_code == 200
        except requests.RequestException as exc:
            print(f"Erro ao verificar URL na API de bloqueados: {exc}")
            return False

    def criar_registro_bloqueado(self, url):
        """Adiciona URL à lista bloqueados via API (evita duplicatas)."""
        url_bloqueio = self._normalize_url_bloqueio(url)
        if not url_bloqueio:
            return
        if self.url_ja_bloqueada(url_bloqueio):
            print(f"URL {url_bloqueio} já está na lista de bloqueados. Ignorando.")
            return
        headers = self._bloqueio_resist_api_headers()
        if not headers:
            return
        try:
            response = requests.post(
                f"{self._bloqueio_resist_api_base()}/listas/bloqueados",
                json={"url": url_bloqueio},
                headers=headers,
                timeout=10,
            )
            if response.status_code == 401:
                self._resist_api_token = None
                headers = self._bloqueio_resist_api_headers()
                if not headers:
                    return
                response = requests.post(
                    f"{self._bloqueio_resist_api_base()}/listas/bloqueados",
                    json={"url": url_bloqueio},
                    headers=headers,
                    timeout=10,
                )
            response.raise_for_status()
            print(f"\n * URL {url_bloqueio} adicionada à lista de bloqueados (API).")
        except requests.RequestException as exc:
            print(f"Erro ao adicionar URL na API de bloqueados: {exc}")

    def notificar_highlight_nav(
        self,
        nav_id: str,
        frases: list,
        motivos: Optional[List[str]] = None,
    ) -> bool:
        """
        Envia frases ofensivas ao SSE da página com esse navId (emitido pelo mitmproxy no log).
        O tabId do browser não passa pelo main; o navId identifica o carregamento correto.
        Retorna True se algum endpoint aceitar o POST com sucesso.
        """
        if not nav_id or not frases:
            return False
        preview = [f[:80] + ("..." if len(f) > 80 else "") for f in frases[:3]]
        for base in self._sse_candidate_bases():
            url = f"{base}/send-to-nav"
            print(f"[SSE] POST {url} | navId={nav_id} | n_frases={len(frases)} | preview={preview!r}")
            try:
                response = requests.post(
                    url,
                    json={"navId": nav_id, "frases": list(frases), "motivos": list(motivos or [])},
                    timeout=8,
                )
                response.raise_for_status()
                body = response.json()
                print(f"[SSE] resposta HTTP {response.status_code}: {body}")
                return True
            except requests.RequestException as e:
                print(f"[SSE] falha ao notificar navId={nav_id} em {url}: {e}")
        return False

    def notificar_verificacao_nav(self, nav_id: str, bloqueado: bool) -> bool:
        """
        Sinaliza para a página que a verificação terminou.
        Usado pelo VERIFY_GATE para liberar carregamento.
        Retorna True se algum endpoint aceitar o POST com sucesso.
        """
        if not nav_id:
            return False
        for base in self._sse_candidate_bases():
            url = f"{base}/send-status-to-nav"
            try:
                response = requests.post(
                    url,
                    json={"navId": nav_id, "verified": True, "bloqueado": bool(bloqueado)},
                    timeout=6,
                )
                response.raise_for_status()
                try:
                    _body = response.json()
                except Exception:
                    _body = response.text
                print(f"[SSE] status verificação HTTP {response.status_code}: {_body}")
                return True
            except requests.RequestException as e:
                print(f"[SSE] falha ao enviar status de verificação navId={nav_id} em {url}: {e}")
        return False

    def bloquear_sites(self, nome_arquivo):
        """Bloqueia sites somente se a flag 'bloquear' for True."""
        # if nome_arquivo in os.listdir(self.html_directory):
        print("~~~~iniciando teste de bloqueio")
        if nome_arquivo.endswith('.txt') or nome_arquivo.endswith('.enc'):
            # print("é txt!")
            hash_nome = nome_arquivo[:-4]
            resultado = self.verificar_html(hash_nome)  # retorna dict
            print("-> resultado da i.a: ", resultado)
            if resultado.get("bloquear"):
                url = self.extrair_url_do_arquivo(os.path.join(self.html_directory, nome_arquivo))
                if url:
                    print(f"\n ---- Bloqueando {url} - Motivo: {resultado.get('motivo')} | Score: {resultado.get('score')} ----\n")
                    if os.getenv("URL_BLOCKLIST_ON_TOXIC", "false").lower() in ("1", "true", "yes"):
                        self.criar_registro_bloqueado(url)
                    return resultado
                else:
                    print("Não tenho pq bloquear essa página")
                    return resultado

            return resultado

    def imprimir_conteudo_html(self, url):
        """Imprime o conteúdo do arquivo HTML correspondente à URL."""
        import hashlib
        hash_nome = hashlib.md5(url.encode()).hexdigest()
        caminho_html = os.path.join(self.html_directory, f"{hash_nome}.txt")

        if os.path.exists(caminho_html):
            with open(caminho_html, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                print(f"Conteúdo de {url}:\n{conteudo}")
        else:
            print(f"O arquivo HTML para {url} não existe.")

def main():
    bloqueio = Bloqueio(
        arm_file_path=os.getenv('ARM_FILE_PATH'),
        html_directory=os.getenv('HTML_DUMPS_DIR'),
    )
    bloqueio.bloquear_sites()

if __name__ == "__main__":
    main()
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
    bloqueados_file_path=os.getenv('BLOQUEADOS_FILE_PATH', '/root/bloqueados.txt')
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
                print(f"Error parsing datetime: {e}")
                return None
        
        def __init__(self, squid_log_file_path=None, position_file_path=None):
            self.squid_log_file_path = squid_log_file_path or os.getenv('LOGS_FILE_PATH', '/root/logs.txt')
            self.position_file_path = position_file_path or os.getenv('ARM_FILE_PATH', '/root/arm.txt')
            self.processed_lines = set()
            self.read_processed_urls()  # Carrega as URLs processadas ao iniciar
            print("MonitorLog inicializado com sucesso.")

        def read_processed_urls(self):
            """Lê as URLs já processadas do arquivo arm.txt."""
            if os.path.exists(self.position_file_path):
                with open(self.position_file_path, 'r') as file:
                    for line in file:
                        self.processed_lines.add(line.strip())
            print("URLs previamente processadas carregadas.")

        def tail_file(self):
            print("Método para ler o arquivo de log continuamente.")
            try:
                with open(self.squid_log_file_path, 'r') as file:
                    print(f"Arquivo {self.squid_log_file_path} aberto para monitoramento.")
                    file.seek(0, os.SEEK_END)  # Move para o final do arquivo
                    
                    while True:
                        line = file.readline()
                        
                        if not line:  # Se não há uma nova linha, espera um pouco
                            time.sleep(0.1)
                            continue
                        
                        print(f"Nova linha de log detectada: {line.strip()}")
                        # if line.strip() not in self.processed_lines:
                        threading.Thread(target=self.process_line, args=(line,)).start()
                        self.processed_lines.add(line.strip())
            except Exception as e:
                print(f"Erro ao monitorar o arquivo de log: {e}")

        def process_line(self, line):
            with semaforo:
                print("Iniciando processamento da linha de log.")
                
                # Verifica se a linha termina com .com:443 ou contém um domínio válido com .com ou extensões similares
                if not re.search(r'\.[a-z](\.[a-z]{2,3})?(:\d+)?', line.strip(), re.IGNORECASE):
                    print(f"Linha ignorada, não segue o padrão esperado: {line.strip()}")
                    return  # Ignora a linha e sai da função

                url = dado.extract_site_from_log_line(line)
                if url:
                    print(f"URL extraída: {url}")
                    dado.url = url if url.startswith("http") else f"http://{url}"
                    dado.url = dado.url.replace(":433", "")
                    dado.url = dado.url.replace(":http://", "")
                    dado.url = dado.url.replace("http://", "").replace("https://", "") 
                    
                    # Adiciona validação para excluir domínios indesejados
                    excluded_domains = [
                        'googlesyndication.com',
                        'google-analytics.com',
                        'doubleclick.net',
                        'google.com',
                        'gstatic.com',
                        'googleapis.com'
                    ]
                    
                    if any(domain in dado.url for domain in excluded_domains):
                        print(f"URL ignorada por ser de um domínio excluído: {dado.url}")
                        return
                        
                    site = dado.url
                    print(f"O site é {site}")# Remove o protocolo
                    
                    dado.ip_maquina = dado.extract_ip_from_log_line(line)
                    dado.data = dado.extract_date_from_log_line(line)
                    dado.hora = dado.extract_time_from_log_line(line)
                    # print(f"dado.data:{dado.data}")
                    if dado.data is None or dado.hora is None:
                        print(f"Erro: data ou hora inválida na linha: {line.strip()}")
                        return  # Ignora o processamento da linha
                    
                    dado.data_hora = self.format_datetime(dado.data, dado.hora)
                    print(f"Dados extraídos -> URL: {dado.url}, IP: {dado.ip_maquina}, Data/Hora: {dado.data_hora}")

                    # Verifica se a URL já foi processada
                    # if dado.url not in self.processed_lines:
                        # if not idx.is_site_indexed(dado.url):
                            
                    print(f"URL não indexada previamente. Iniciando indexação de {dado.url}")
                    html = dado.extract_html(dado.url) or ""
                            
                    clean_html = dado.remove_html_tags(html)
                    print("HTML limpo de tags para armazenamento local.")
                    print(f"\n\n~~~~~~~~~~~~\n{clean_html}\n\n~~~~~~~~~~\n\n")

                            # Tirando os caracteres que podem causar problemas no nome do arquivo
                            # hash_nome = hashlib.md5(dado.url.encode()).hexdigest()
                    nome_arquivo = filename_from_url(dado.url, unique_len=16)
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
                            
                    payload_bytes = f"<urlDoSite>{dado.url}</urlDoSite>\n{clean_html}".encode('utf-8')
                    encrypt_and_atomic_write(caminho_html, payload_bytes)
                            
                    print(f"Arquivo criptografado salvo em: {caminho_html}")
                            
                            # Escreve o HTML no arquivo
                            # with open(caminho_html, 'w', encoding='utf-8') as f:
                            #     f.write(f"<urlDoSite>{dado.url}</urlDoSite>\n{clean_html}")
                                
                    print(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ caminho:{caminho_html}")
                           
                    dado.append_site_to_arm_file(self.position_file_path, dado.extract_site(line.strip()))
                    self.processed_lines.add(dado.extract_site(line.strip()))  # Marca a URL como processada
                    print(f"URL adicionada ao arquivo de controle: {self.position_file_path}")

                            # Converte a string de data/hora para um objeto datetime
                    data_hora_obj = datetime.strptime(dado.data_hora.split('.')[0], "%d-%m-%YT%H:%M:%S")
                            
                            
                    print(f"Dados indexados com sucesso no MongoDB para a URL {dado.url}")
                    result = bloqueio.bloquear_sites(nome_arquivo)

                    # print(dado.url.strip())
                    # print(idx.is_site_indexed(dado.url.strip()))
                    # print(idx.is_site_indexed("cooktest60.vercel.app"))
                    # print(idx.buscar_site_por_url(dado.url.strip()))
                    # print(idx.buscar_site_por_url("cooktest60.vercel.app"))
                    if idx.is_site_indexed(dado.url.strip())==False:
                        idx.indexar_site({
                            "PathLocal": caminho_html,
                            "urlWeb": dado.url,
                            "dataHora": data_hora_obj,  # Envia como objeto datetime
                            "flag": True if result == "bloqueado" else False,
                            "ipMaquina": dado.ip_maquina,
                            "tipoInsercao": "Automatico",
                        })
                        print("o nome do arquivo é ", nome_arquivo)
                    else:
                        print(f"URL {dado.url} já indexada. Re-verificando e salvando como acesso.")
                        indexed_site = idx.buscar_site_por_url(dado.url)  # Função para buscar o site pelo URL
                        
                        idx.atualizar_indexacao(
                            urlWeb=dado.url.strip(),
                            dados_atualizados={
                                "PathLocal": caminho_html,
                                # "motivo": "?"
                                "urlWeb": dado.url,
                            }
                        )

                        indexed_site = idx.buscar_site_por_url(dado.url)  # Trocar por uma resposta do atualizar indexacao, que vai trazer a flag.
                        if indexed_site:
                            flag = indexed_site.get('flag', None)  # Obter a flag do site indexado
                        else:
                            flag = "false"  # Se não encontrar, assume flag como false

                                
                        acc.registrar_acesso({
                            "ipMaquina": dado.ip_maquina,
                            "urlWeb": dado.url,
                            "dataHora": dado.data_hora,
                            "flag":flag
                        })
                        print(f"Acesso salvo com sucesso no MongoDB para a URL {dado.url}")
                    # else:
                        # print(f"URL {dado.url} já processada anteriormente. Ignorando.")
                else:
                    print("Nenhuma URL válida encontrada na linha de log.")

    def check_required_files():
        required_files = [
            os.getenv('LOGS_FILE_PATH', '/root/logs.txt'),
            os.getenv('ARM_FILE_PATH', '/root/arm.txt'),
            os.getenv('BLOQUEADOS_FILE_PATH', '/root/bloqueados.txt')
        ]
        for file_path in required_files:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    pass
                print(f"Arquivo criado: {file_path}")


    def login_and_get_token():
        """Logs into the API and sets the auth token as an environment variable."""
        api_base_url = os.getenv('API_URL', 'http://localhost:4000/api')
        login_url = f"{api_base_url}/login"
        email = os.getenv('SYSTEM_EMAIL')
        password = os.getenv('SYSTEM_PASSWORD')

        if not email or not password:
            print("Erro: SYSTEM_EMAIL e SYSTEM_PASSWORD devem ser definidos no ambiente.")
            return False

        try:
            print("Tentando fazer login na API para obter o token...")
            response = requests.post(login_url, json={"email": email, "senha": password})
            response.raise_for_status()  # Lança exceção para status de erro (4xx/5xx)
            
            token = response.json().get('token')
            if token:
                os.environ['API_TOKEN'] = token
                print("Login bem-sucedido. Token de autenticação obtido e configurado.")
                return True
            else:
                print("Erro: Token não encontrado na resposta da API.")
                return False
        except requests.exceptions.RequestException as e:
            print(f"Erro ao fazer login na API: {e}")
            return False

    def main():
        check_required_files()
        if login_and_get_token():
            squid_log_file_path = os.getenv('LOGS_FILE_PATH', '/root/logs.txt')
            position_file_path = os.getenv('ARM_FILE_PATH', '/root/arm.txt')
            print("Inicializando monitor de log...")
            monitor = MonitorLog(squid_log_file_path, position_file_path)
            monitor.tail_file()
        else:
            print("Encerrando o programa devido a falha no login da API.")

    if __name__ == "__main__":
        print("Iniciando o script principal...")
        main()
else:
    print("Encerrando o programa devido a erro na conexão com o banco de dados.")

    #sudo systemctl restart mitmproxy.service

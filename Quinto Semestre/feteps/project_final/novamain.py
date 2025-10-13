import time
import threading
from tratamentoDados import TratamentoDados
from indexacoes import Indexacoes, Acessos
import requests
import re
import os
from pymongo import MongoClient
from datetime import datetime


# Obtém a string de conexão do MongoDB
mongoDBURI = "<<urlmongo>>"

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
    db = client['resist']

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
            
            # Tenta analisar a string com milissegundos
            try:
                dt = datetime.strptime(datetime_str, "%d/%m/%Y %H:%M:%S:%f")
                # Se a conversão for bem-sucedida, formate a saída com milissegundos
                return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "+00:00"  # Mantém os 3 primeiros dígitos dos milissegundos
            except ValueError:
                # Se falhar, tenta analisar sem milissegundos
                dt = datetime.strptime(datetime_str, "%d/%m/%Y %H:%M:%S")
                # Retorna a data no formato ISO 8601 sem milissegundos
                return dt.strftime("%Y-%m-%dT%H:%M:%S") + "+00:00"
        
        def __init__(self, squid_log_file_path, position_file_path):
            self.squid_log_file_path = squid_log_file_path
            self.position_file_path = position_file_path
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
                with open(self.squid_log_file_path, 'r', buffering=1) as file:
                    print(f"Arquivo {self.squid_log_file_path} aberto para monitoramento.")
                    file.seek(0, os.SEEK_END)  # Move para o final do arquivo
                    
                    while True:
                        line = file.readline()
                        
                        if not line:  # Se não há uma nova linha, espera um pouco
                            time.sleep(0.3)
                            continue
                        
                        print(f"Nova linha de log detectada: {line.strip()}")
                        if line.strip() not in self.processed_lines:
                            threading.Thread(target=self.process_line, args=(line,)).start()
                            self.processed_lines.add(line.strip())
            except Exception as e:
                print(f"Erro ao monitorar o arquivo de log: {e}")

        def process_line(self, line):
            with semaforo:
                print("Iniciando processamento da linha de log.")
                
                # Verifica se a linha termina com .com:443 ou contém um domínio válido com .com ou extensões similares
                if not re.search(r'\.com(\.[a-z]{2,3})?(:\d+)?', line.strip(), re.IGNORECASE):
                    print(f"Linha ignorada, não segue o padrão esperado: {line.strip()}")
                    return  # Ignora a linha e sai da função

                url = dado.extract_site_from_log_line(line)
                if url:
                    print(f"URL extraída: {url}")
                    dado.url = url if url.startswith("http") else f"http://{url}"
                    dado.url = dado.url.replace(":433", "")
                    dado.url = dado.url.replace(":http://", "")
                    dado.url = dado.url.replace("http://", "").replace("https://", "") 
                    site = dado.url
                    print(f"O SITE EEE E E {site}")# Remove o protocolo
                    
                    dado.ip_maquina = dado.extract_ip_from_log_line(line)
                    dado.data = dado.extract_date_from_log_line(line)
                    dado.hora = dado.extract_time_from_log_line(line)
                    dado.data_hora = self.format_datetime(dado.data, dado.hora)
                    print(f"Dados extraídos -> URL: {dado.url}, IP: {dado.ip_maquina}, Data/Hora: {dado.data_hora}")

                    # Verifica se a URL já foi processada
                    if dado.url not in self.processed_lines:
                        if not idx.is_site_indexed(dado.url):
                            print(f"URL não indexada previamente. Iniciando indexação de {dado.url}")
                            html = dado.extract_html(dado.url) or ""
                            
                            clean_html = dado.remove_html_tags(html)
                            print("HTML limpo de tags para armazenamento local.")
                            print(f"\n\n~~~~~~~~~~~~\n{clean_html}\n\n~~~~~~~~~~\n\n")

                            # Tirando os caracteres que podem causar problemas no nome do arquivo
                            nome_arquivo = dado.url #.replace("http://", "").replace("https://", "").replace("/", "_").replace(":", "_").replace(".", "_")
                            
                            # Lugar para salvar os HTMLs
                            diretorio_html = r"/home/server/Desktop/htmls"
                            caminho_html = os.path.join(diretorio_html, f"{nome_arquivo}.txt")
                            
                            # Se não tiver a pasta, ele cria
                            if not os.path.exists(diretorio_html):
                                os.makedirs(diretorio_html)
                            
                            # Escreve o HTML no arquivo
                            with open(caminho_html, 'w', encoding='utf-8') as f:
                                f.write(clean_html)
                                
                            print(f"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ caminho:{caminho_html}")
                            #print(f"EXTRAIDOOOOOOOOOOOOOOOOOOOOOOOO:{dado.extract_site(line.strip())}")
                            dado.append_site_to_arm_file(self.position_file_path, dado.extract_site(line.strip()))
                            self.processed_lines.add(dado.extract_site(line.strip()))  # Marca a URL como processada
                            print(f"URL adicionada ao arquivo de controle: {self.position_file_path}")

                            # Converte a string de data/hora para um objeto datetime
                            data_hora_obj = datetime.strptime(dado.data_hora, "%Y-%m-%dT%H:%M:%S+00:00")
                            
                            idx.indexar_site({
                                "PathLocal": caminho_html,
                                "urlWeb": dado.url,
                                "dataHora": data_hora_obj,  # Envia como objeto datetime
                                "flag": "false",
                                "ipMaquina": dado.ip_maquina,
                                "tipoInsercao": "Automatico",
                            })
                            print(f"Dados indexados com sucesso no MongoDB para a URL {dado.url}")
                        
                        else:
                            print(f"URL {dado.url} já indexada. Salvando como acesso.")
                            indexed_site = idx.buscar_site_por_url(dado.url)  # Função para buscar o site pelo URL
                            
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
                    else:
                        print(f"URL {dado.url} já processada anteriormente. Ignorando.")
                else:
                    print("Nenhuma URL válida encontrada na linha de log.")

    def check_required_files():
        required_files = [
            "/var/log/squid/access.txt",  # Caminho correto para o arquivo de log no Linux
            "/home/server/Desktop/arm.txt",
            "/etc/squid/files/bloqueados.txt"
        ]
        
        for file_path in required_files:
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    pass
                print(f"Arquivo criado: {file_path}")

    def main():
        check_required_files()
        squid_log_file_path = "/var/log/squid/access.txt"
        position_file_path = "/home/server/Desktop/arm.txt"
        
        print("Inicializando monitor de log...")
        monitor = MonitorLog(squid_log_file_path, position_file_path)
        monitor.tail_file()

    if __name__ == "__main__":
        print("Iniciando o script principal...")
        main()

else:
    print("Encerrando o programa devido a erro na conexão com o banco de dados.")
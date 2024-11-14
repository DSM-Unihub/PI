import time
import threading
from pymongo import MongoClient
from tratamento_dados import TratamentoDados
from indexacoes import Indexacoes
from acessos import Acessos
import requests

# Configuração MongoDB Atlas
client = MongoClient("sua_string_de_conexao_mongodb_atlas")
db = client['nome_do_banco']

# Inicializa as classes de tratamento, indexação e acessos
dado = TratamentoDados(db)
idx = Indexacoes(db)
acc = Acessos(db)

# Semáforo para limitar o número de requisições simultâneas
semaforo = threading.Semaphore(5)

class MonitorLog:
    def __init__(self, squid_log_file_path, position_file_path):
        self.squid_log_file_path = squid_log_file_path
        self.position_file_path = position_file_path
        self.processed_lines = set()

    def tail_file(self):
        """
        Método para ler o arquivo de log continuamente.
        """
        try:
            with open(self.squid_log_file_path, 'r') as file:
                file.seek(0, os.SEEK_END)
                
                while True:
                    line = file.readline()
                    if not line:
                        time.sleep(0.1)
                        continue
                    
                    if line.strip() not in self.processed_lines:
                        threading.Thread(target=self.process_line, args=(line,)).start()
                        self.processed_lines.add(line.strip())

        except Exception as e:
            print(f"Erro ao monitorar o arquivo de log: {e}")

    def process_line(self, line):
        """
        Processa cada linha de log e interage com MongoDB.
        """
        url = dado.extract_site_from_log_line(line)
        if url:
            # Define dados da URL
            dado.url = url if url.startswith("http") else f"http://{url}"
            dado.ip_maquina = dado.extract_ip_from_log_line(line)
            dado.data = dado.extract_date_from_log_line(line)
            dado.hora = dado.extract_time_from_log_line(line)
            dado.data_hora = f"{dado.data}:{dado.hora}"

            if not idx.is_site_indexed(dado.url):
                html = dado.extract_html(dado.url) or ""
                flag = dado.verificar_flag_no_html(html, "explosões")

                if flag:
                    with open("bloqueados.txt", 'a') as bloqueados_file:
                        bloqueados_file.write(f"{dado.url}\n")

                    dado.store_bloqueado_notification(dado.url, "explosões")
                
                clean_html = dado.remove_html_tags(html)
                dado.append_site_to_arm_file(self.position_file_path, line.strip())

                idx.indexar_site({
                    "ipMaquina": dado.ip_maquina,
                    "urlWeb": dado.url,
                    "dataHora": dado.data_hora,
                    "flag": flag,
                    "tipoInsercao": "Automatico"
                })
            else:
                acc.registrar_acesso({
                    "urlWeb": dado.url,
                    "ipMaquina": dado.ip_maquina,
                    "dataHora": dado.data_hora
                })

def main():
    squid_log_file_path = "/caminho/para/access.log"
    position_file_path = "/caminho/para/arm.txt"

    monitor = MonitorLog(squid_log_file_path, position_file_path)
    monitor.tail_file()

if __name__ == "__main__":
    main()

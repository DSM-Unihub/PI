import time
import os
import threading
from pymongo import MongoClient
from tratamento_dados import TratamentoDados
from indexacoes import Indexacoes
from acessos import Acessos

# Semáforo para limitar o número de requisições simultâneas
semaforo = threading.Semaphore(5)  # Limita a 5 requisições simultâneas

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
                # Vai até o final do arquivo (não processa as linhas antigas)
                file.seek(0, os.SEEK_END)
                
                while True:
                    # Lê a próxima linha
                    line = file.readline()
                    if not line:
                        # Aguarda um pouco se não houver novas linhas
                        time.sleep(0.1)
                        continue
                    
                    # Se a linha não foi processada antes, processa
                    if line.strip() not in self.processed_lines:
                        self.process_line(line)
                        # Marca a linha como processada
                        self.processed_lines.add(line.strip())

        except Exception as e:
            print(f"Erro ao monitorar o arquivo de log: {e}")

    def process_line(self, line):
        """
        Processa cada linha de log, verificando se o site já foi indexado e processando conforme necessário.
        """
        dado = TratamentoDados(db)  # Instancia a classe de dados com a conexão ao banco
        idx = Indexacoes(db)        # Instancia a classe de indexações
        acc = Acessos(db)           # Instancia a classe de acessos

        url = dado.extract_site_from_log_line(line)
        if url:
            dado.url = url if url.startswith("http") else f"http://{url}"
            dado.ip_maquina = dado.extract_ip_from_log_line(line)
            dado.data = dado.extract_date_from_log_line(line)
            dado.hora = dado.extract_time_from_log_line(line)
            dado.data_hora = f"{dado.data}:{dado.hora}"

            # Carrega os sites previamente adicionados
            sites_adicionados = dado.load_sites_from_file(self.position_file_path)
            if dado.url and dado.url not in sites_adicionados:
                print(f"Novo site no arquivo de log: {dado.url}")
                
                # Verifica se o site já foi indexado
                if not idx.is_site_indexed(dado.url):
                    print(f"Indexando e salvando no banco: {dado.url}")

                    # Extração do HTML do site
                    html = dado.extract_html(dado.url) or ""

                    # Verifica se o conteúdo contém a palavra "explosões"
                    flag = dado.verificar_flag_no_html(html, "explosões")

                    if flag:
                        # Adiciona a URL ao arquivo bloqueados.txt
                        with open("bloqueados.txt", 'a') as bloqueados_file:
                            bloqueados_file.write(f"{dado.url}\n")
                        print(f"URL {dado.url} adicionada ao arquivo bloqueados.txt")

                    # Limpa o HTML (remove tags) antes de salvar localmente
                    clean_html = dado.remove_html_tags(html)

                    # Adiciona a URL ao arquivo de armamento
                    dado.append_site_to_arm_file(self.position_file_path, line.strip())

                    # Salvamento do conteúdo limpo do HTML em arquivo
                    local = f"C:\\Users\\fatec-dsm3\\Downloads\\{dado.show_host(dado.url)}.txt"
                    with open(local, 'w') as file:
                        file.write(clean_html)

                    # Define a flag com base na verificação do conteúdo
                    idx.set_flag(flag)  # Define a flag para True se "explosões" foi encontrado

                else:
                    print(f"O site {dado.url} já foi indexado. Salvando em Acessos.")

                    # Registro de acesso (se o site já foi indexado)
                    acc.set_url(dado.url)
                    acc.set_data_hora(dado.convert_to_mysql_format(dado.data_hora))
                    acc.set_ip_maquina(dado.ip_maquina)
                    acc.cadastrar()

                # Adiciona o site ao arquivo de armamento
                dado.append_site_to_arm_file(self.position_file_path, line.strip())

            else:
                print(f"O site {dado.url} já foi processado anteriormente.")
        else:
            print(f"URL inválida ou não encontrada na linha: {line}")

def main():
    squid_log_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\access.txt"  # Caminho do arquivo de log de acessos
    position_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\arm.txt"      # Caminho do arquivo de posição (armazenamento de URLs já processadas)

    monitor = MonitorLog(squid_log_file_path, position_file_path)
    monitor.tail_file()

if __name__ == "__main__":
    main()

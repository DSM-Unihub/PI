import time
import threading
from tratamento_dados import TratamentoDados
from indexacoes import Indexacoes
from acessos import Acessos

# Semáforo para limitar o número de requisições simultâneas
semaforo = threading.Semaphore(5)  # Limita a 5 requisições simultâneas

def processar_linha(line, dado, idx, acc, position_file_path):
    try:
        url = dado.extract_site_from_log_line(line)
        if url:
            dado.url = url if url.startswith("http") else f"http://{url}"
            dado.ip_maquina = dado.extract_ip_from_log_line(line)
            dado.data = dado.extract_date_from_log_line(line)
            dado.hora = dado.extract_time_from_log_line(line)
            dado.data_hora = f"{dado.data}:{dado.hora}"

            # Carrega os sites previamente adicionados
            sites_adicionados = dado.load_sites_from_file(position_file_path)
            if dado.url and dado.url not in sites_adicionados:
                print(f"Novo site no arquivo de log: {dado.url}")
                print(f"Indexando e salvando no banco: {dado.url}")

                # Indexação do site
                idx.set_pathLocal(dado.url)
                idx.set_urlWeb(dado.url)
                idx.set_pathLocal(f"{dado.show_host(dado.url)}.txt")
                
                # Extração do HTML do site
                html = dado.extract_html(dado.url) or ""

                # Verifica se o conteúdo contém a palavra "explosões"
                flag = False
                if "explosões" in html.lower():  # Verifica se "explosões" está no conteúdo do HTML
                    flag = True

                    # Adiciona a URL ao arquivo bloqueados.txt
                    with open("bloqueados.txt", 'a') as bloqueados_file:
                        bloqueados_file.write(f"{dado.url}\n")
                    print(f"URL {dado.url} adicionada ao arquivo bloqueados.txt")

                # Passando os parâmetros necessários para indexar_site
                tipo_insercao = "novo"  # Defina o valor correto para 'tipo_insercao'
                idx.indexar_site(dado.ip_maquina, dado.data_hora, tipo_insercao)

                print(f"---\nNovo acesso a: {dado.url}")
                print(f"DataHora: {dado.data_hora}")
                print(f"Máquina que acessou (IP): {dado.ip_maquina}")

                # Registro de acesso
                acc.set_url(dado.url)
                acc.set_data_hora(dado.convert_to_mysql_format(dado.data_hora))
                acc.set_ip_maquina(dado.ip_maquina)
                acc.cadastrar()

                # Adiciona o site ao arquivo de armamento
                dado.append_site_to_arm_file(position_file_path, line.strip())

                # Salvamento do HTML em arquivo
                local = f"C:\\Users\\fatec-dsm3\\Downloads\\{dado.show_host(dado.url)}.txt"
                with open(local, 'w') as file:
                    file.write(html)

                # Definir a flag com base na verificação do conteúdo
                idx.set_flag(flag)  # Define a flag para True se "explosões" foi encontrado

    except Exception as e:
        print(f"Erro ao processar a linha do log: {e}")
    finally:
        # Libera o semáforo depois que a linha for processada
        semaforo.release()

def main():
    dado = TratamentoDados()  # Classe responsável por tratar os dados do log.
    idx = Indexacoes()        # Classe responsável por indexar URLs no banco de dados.
    acc = Acessos()           # Classe responsável por registrar acessos no banco de dados.
    
    squid_log_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\access.txt"  # Caminho do arquivo de log de acessos.
    position_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\arm.txt"      # Caminho do arquivo de posição (armazenamento de URLs já processadas).

    try:
        with open(squid_log_file_path, 'r') as file:
            # Usa threads para processar as linhas do log simultaneamente, mas limitadas pelo semáforo
            threads = []
            for line in file:
                # Adquire o semáforo antes de processar
                semaforo.acquire()

                # Cria uma nova thread para processar cada linha
                thread = threading.Thread(target=processar_linha, args=(line, dado, idx, acc, position_file_path))
                threads.append(thread)
                thread.start()

            # Aguarda todas as threads terminarem
            for thread in threads:
                thread.join()

    except (IOError, Exception) as e:
        print(f"Erro ao ler arquivo de log: {e}")

if __name__ == "__main__":
    main()

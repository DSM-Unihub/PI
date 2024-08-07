import time
from tratamento_dados import TratamentoDados
from indexacoes import Indexacoes
from acessos import Acessos

def main():
    dado = TratamentoDados()
    idx = Indexacoes()
    acc = Acessos()
    squid_log_file_path = "/var/log/squid/access.log"
    position_file_path = "/home/vboxuser/Desktop/arm.txt"

    while True:
        try:
            with open(squid_log_file_path, 'r') as file:
                for line in file:
                    url = dado.extract_site_from_log_line(line)
                    if url:
                        dado.url = url if url.startswith("http") else f"http://{url}"
                        dado.ip_maquina = dado.extract_ip_from_log_line(line)
                        dado.data = dado.extract_date_from_log_line(line)
                        dado.hora = dado.extract_time_from_log_line(line)
                        dado.data_hora = f"{dado.data}:{dado.hora}"

                        sites_adicionados = dado.load_sites_from_file(position_file_path)
                        if dado.url and dado.url not in sites_adicionados:
                            if not idx.pesquisar(dado.url):
                                print(f"Novo site no arquivo de log: {dado.url}")
                                print(f"Indexando e salvando no banco: {dado.url}")
                                idx.set_path_local(dado.url)
                                idx.set_flag(True)
                                idx.set_url_web(dado.url)
                                idx.set_path_local(f"{dado.show_host(dado.url)}.txt")
                                idx.indexar_site()

                            print(f"Novo acesso a: {dado.url}")
                            print(f"DataHora: {dado.data_hora}")
                            print(f"Máquina que acessou (IP): {dado.ip_maquina}")
                            acc.set_url(dado.url)
                            acc.set_data_hora(dado.convert_to_mysql_format(dado.data_hora))
                            acc.set_ip_maquina(dado.ip_maquina)
                            acc.set_id_index_fk(int(idx.retornar_id_index(dado.url)))
                            acc.cadastrar()

                            html = dado.extract_html(dado.url) or ""
                            html_com_aspas_duplas = html.replace("'", "\"")
                            dado.append_site_to_arm_file(position_file_path, line.strip())

                            local = f"/home/vboxuser/Desktop/sites/{dado.show_host(dado.url)}.txt"
                            with open(local, 'w') as file:
                                file.write(html_com_aspas_duplas)

        except (IOError, Exception) as e:
            print(f"Erro ao ler arquivo de log: {e}")

        time.sleep(5)

if __name__ == "__main__":
    main()

import time
from tratamento_dados import TratamentoDados
from indexacoes import Indexacoes
from acessos import Acessos

def main():
    # Instancia as classes necessárias para o processamento.
    dado = TratamentoDados()
    idx = Indexacoes()
    acc = Acessos()
    
    # Caminhos dos arquivos de log e de posição.
    squid_log_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\access.txt"
    position_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\arm.txt"

    try:
        # Abre o arquivo de log para leitura.
        with open(squid_log_file_path, 'r') as file:
            # Itera sobre cada linha do arquivo de log.
            for line in file:
                try:
                    # Extrai URL, IP, data e hora da linha do log.
                    url = dado.extract_site_from_log_line(line)
                    if url:
                        dado.url = url if url.startswith("http") else f"http://{url}"
                        dado.ip_maquina = dado.extract_ip_from_log_line(line)
                        dado.data = dado.extract_date_from_log_line(line)
                        dado.hora = dado.extract_time_from_log_line(line)
                        dado.data_hora = f"{dado.data}:{dado.hora}"

                        # Carrega sites previamente adicionados do arquivo de posição.
                        sites_adicionados = dado.load_sites_from_file(position_file_path)
                        if dado.url and dado.url not in sites_adicionados:
                            if not idx.pesquisar(dado.url):
                                # Se a URL não está indexada, indexa e salva no banco de dados.
                                print(f"Novo site no arquivo de log: {dado.url}")
                                print(f"Indexando e salvando no banco: {dado.url}")
                                idx.set_pathLocal(dado.url)
                                idx.set_flag(True)
                                idx.set_urlWeb(dado.url)
                                idx.set_pathLocal(f"{dado.show_host(dado.url)}.txt")
                                idx.indexar_site()

                            # Registra o acesso ao site no banco de dados.
                            print(f"---\nNovo acesso a: {dado.url}")
                            print(f"DataHora: {dado.data_hora}")
                            print(f"Máquina que acessou (IP): {dado.ip_maquina}")
                            acc.set_url(dado.url)
                            acc.set_data_hora(dado.convert_to_mysql_format(dado.data_hora))
                            acc.set_ip_maquina(dado.ip_maquina)
                            acc.set_id_index_fk(idx.retornar_id_index(dado.url))
                            acc.cadastrar()

                            # Extrai o HTML da URL e salva em um arquivo.
                            html = dado.extract_html(dado.url) or ""
                            html_com_aspas_duplas = html.replace("'", "\"")
                            dado.append_site_to_arm_file(position_file_path, line.strip())

                            local = f"C:\\Users\\fatec-dsm3\\Downloads\\{dado.show_host(dado.url)}.txt"
                            with open(local, 'w') as file:
                                file.write(html_com_aspas_duplas)
                except Exception as e:
                    # Captura e imprime erros ao processar cada linha do log.
                    print(f"Erro ao processar a linha do log: {e}")

    except (IOError, Exception) as e:
        # Captura e imprime erros ao abrir ou ler o arquivo de log.
        print(f"Erro ao ler arquivo de log: {e}")

if __name__ == "__main__":
    main()

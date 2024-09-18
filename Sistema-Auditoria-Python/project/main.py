import time
from tratamento_dados import TratamentoDados
from indexacoes import Indexacoes
from acessos import Acessos
from notification import secondPlace

def main():
    # Instancia as classes necessárias para o processamento de dados.
    dado = TratamentoDados()  # Classe responsável por tratar os dados do log.
    idx = Indexacoes()        # Classe responsável por indexar URLs no banco de dados.
    acc = Acessos()           # Classe responsável por registrar acessos no banco de dados.
    
    # Caminhos dos arquivos de log e de posição.
    squid_log_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\access.txt"  # Caminho do arquivo de log de acessos.
    position_file_path = "C:\\Users\\fatec-dsm3\\Downloads\\arm.txt"      # Caminho do arquivo de posição (armazenamento de URLs já processadas).

    try:
        # Abre o arquivo de log para leitura.
        with open(squid_log_file_path, 'r') as file:
            # Itera sobre cada linha do arquivo de log.
            for line in file:
                try:
                    # Extrai a URL, o IP, a data e a hora da linha do log.
                    url = dado.extract_site_from_log_line(line)  # Extrai a URL da linha do log.
                    if url:
                        # Normaliza a URL, garantindo que comece com "http".
                        dado.url = url if url.startswith("http") else f"http://{url}"
                        dado.ip_maquina = dado.extract_ip_from_log_line(line)  # Extrai o IP da máquina que acessou.
                        dado.data = dado.extract_date_from_log_line(line)     # Extrai a data do acesso.
                        dado.hora = dado.extract_time_from_log_line(line)     # Extrai a hora do acesso.
                        dado.data_hora = f"{dado.data}:{dado.hora}"           # Combina data e hora em um único campo.

                        # Carrega os sites previamente adicionados do arquivo de posição.
                        sites_adicionados = dado.load_sites_from_file(position_file_path)
                        # Verifica se a URL já foi processada.
                        if dado.url and dado.url not in sites_adicionados:
                            # Verifica se a URL já está indexada no banco de dados.
                            if not idx.pesquisar(dado.url):
                                # Se a URL não está indexada, a URL será indexada e salva no banco de dados.
                                print(f"Novo site no arquivo de log: {dado.url}")
                                print(f"Indexando e salvando no banco: {dado.url}")
                                idx.set_pathLocal(dado.url)                   # Define o caminho local do site.
                                idx.set_flag(True)                            # Define a flag de indexação.
                                idx.set_urlWeb(dado.url)                      # Define a URL a ser indexada.
                                idx.set_pathLocal(f"{dado.show_host(dado.url)}.txt")  # Define o nome do arquivo local.
                                idx.indexar_site()                            # Indexa o site no banco de dados.

                            # Registra o acesso ao site no banco de dados.
                            print(f"---\nNovo acesso a: {dado.url}")
                            print(f"DataHora: {dado.data_hora}")
                            print(f"Máquina que acessou (IP): {dado.ip_maquina}")
                            acc.set_url(dado.url)                            # Define a URL acessada.
                            acc.set_data_hora(dado.convert_to_mysql_format(dado.data_hora))  # Converte a data e hora para o formato MySQL.
                            acc.set_ip_maquina(dado.ip_maquina)              # Define o IP da máquina que fez o acesso.
                            acc.set_id_index_fk(idx.retornar_id_index(dado.url))  # Associa o acesso ao índice do site no banco.
                            acc.cadastrar()                                  # Insere o registro de acesso no banco.

                            # Extrai o HTML da URL acessada e o salva em um arquivo.
                            html = dado.extract_html(dado.url) or ""         # Extrai o conteúdo HTML da URL.
                            html_com_aspas_duplas = html.replace("'", "\"")  # Substitui aspas simples por duplas no conteúdo HTML.
                            dado.append_site_to_arm_file(position_file_path, line.strip())  # Adiciona a URL ao arquivo de posição.

                            # Define o caminho para salvar o HTML extraído no disco local.
                            local = f"C:\\Users\\fatec-dsm3\\Downloads\\{dado.show_host(dado.url)}.txt"
                            with open(local, 'w') as file:
                                # Salva o HTML extraído no arquivo.
                                file.write(html_com_aspas_duplas)
                except Exception as e:
                    # Captura e imprime erros ao processar cada linha do log.
                    print(f"Erro ao processar a linha do log: {e}")
                    secondPlace()  # Função de notificação em caso de erro.

    except (IOError, Exception) as e:
        # Captura e imprime erros ao abrir ou ler o arquivo de log.
        print(f"Erro ao ler arquivo de log: {e}")

if __name__ == "__main__":
    # Executa a função principal ao rodar o script.
    main()

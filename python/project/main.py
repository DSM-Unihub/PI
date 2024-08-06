import time
from tratamento_dados import TratamentoDados
from indexacoes import Indexacoes

def main():
    dado = TratamentoDados()
    idx = Indexacoes()
    position_file_path = "C:\\Users\\bruno\\Desktop\\test\\arm.txt"
    squid_log_file_path = "C:\\Users\\bruno\\Desktop\\test\\acc.txt"

    while True:
        try:
            with open(squid_log_file_path, 'r') as file:
                for line in file:
                    dado.set_url(dado.extract_site_from_log_line(line))
                    dado.set_ip_maquina(dado.extract_ip_from_log_line(line))
                    dado.set_data_hora(dado.extract_date_time_from_log_line(line))
                    
                    if dado.get_url() is None:
                        continue
                    
                    if not dado.get_url().startswith("http://") and not dado.get_url().startswith("https://"):
                        dado.set_url("http://" + dado.get_url())

                    sites_adicionados = TratamentoDados.load_sites_from_file(position_file_path)

                    if dado.get_url() and dado.get_url() not in sites_adicionados:
                        if not idx.pesquisar(dado.get_url()):
                            print(f"Novo site no arquivo de log: {dado.get_url()}")
                            print(f"Indexando e salvando no banco {dado.get_url()}")
                            idx.set_pathLocal(dado.get_url())
                            idx.setFlag(True)
                            idx.set_urlWeb(dado.get_url())
                            idx.set_pathLocal(dado.show_host(dado.get_url()) + ".txt")
                            print(idx.get_pathLocal())
                            idx.indexar_site()
                            
                            html = ""
                            print(f"--------\nNovo acesso a: {dado.get_url()}")
                            print(f"DataHora: {dado.get_data_hora()}")
                            print(f"máquina que acessou (ip): {dado.get_ip_maquina()}")
                            acc = Acessos()  # Supondo que a classe Acessos existe e deve ser instanciada
                            acc.set_url(dado.get_url())
                            acc.set_data_hora(dado.convert_to_mysql_format(dado.get_data_hora()))
                            acc.set_ip_maquina(dado.get_ip_maquina())
                            acc.set_id_index_fk(int(idx.retornar_id_index(dado.get_url())))
                            acc.cadastrar()  # Supondo que a função cadastrar existe e deve ser chamada
                            
                            try:
                                html = TratamentoDados.extract_html(dado.get_url())
                            except Exception as e:
                                print(f"Impossível recuperar conteúdo do site, erro: {e}")
                            
                            if html:
                                with open(idx.get_pathLocal(), 'w') as file:
                                    file.write(html)
                                TratamentoDados.append_site_to_arm_file(position_file_path, dado.get_url())
                        else:
                            print(f"O site {dado.get_url()} já foi indexado.")
        except FileNotFoundError:
            print("Arquivo de log não encontrado.")
        except Exception as e:
            print(f"Erro: {e}")

        time.sleep(5)  # Aguardar 5 segundos antes de verificar novamente

if __name__ == "__main__":
    main()

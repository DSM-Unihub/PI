from datetime import datetime
from conexao import Conexao

class Indexacoes:
    def __init__(self):
        self.path_local = None
        self.url_web = None
        self.flag = None

    def set_pathLocal(self, path_local):
        self.path_local = path_local  # Define o caminho local

    def set_urlWeb(self, url):
        self.url_web = url  # Define a URL do site

    def set_flag(self, flag):
        self.flag = flag  # Define a flag para o site (True ou False)

    def indexar_site(self, ip_maquina, data_hora, tipo_insercao):
        try:
            conexao = Conexao()
            conexao.insert_document(
                'indexacoes',
                ip_maquina,
                self.url_web,
                data_hora,
                self.flag,
                "Automatico"
            )
        except Exception as e:
            print(f"Erro ao indexar site: {e}")
        finally:
            conexao.close()

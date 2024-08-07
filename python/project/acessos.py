from conexao import Conexao

class Acessos:
    def __init__(self):
        self.conexao = Conexao()

    def set_url(self, url):
        self.url = url

    def set_data_hora(self, data_hora):
        self.data_hora = data_hora

    def set_ip_maquina(self, ip_maquina):
        self.ip_maquina = ip_maquina

    def set_id_index_fk(self, id_index_fk):
        self.id_index_fk = id_index_fk

    def cadastrar(self):
        sql = f"INSERT INTO acessos (url, data_hora, ip_maquina, id_index_fk) VALUES ('{self.url}', '{self.data_hora}', '{self.ip_maquina}', {self.id_index_fk})"
        self.conexao.execute_sql(sql)

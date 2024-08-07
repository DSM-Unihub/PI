from conexao import Conexao

class Indexacoes:
    def __init__(self):
        self.conexao = Conexao()

    def pesquisar(self, url):
        sql = f"SELECT COUNT(*) FROM indexacoes WHERE url_web = '{url}'"
        resultado = self.conexao.fetch_result(sql)
        return resultado[0][0] > 0 if resultado else False

    def set_path_local(self, path_local):
        self.path_local = path_local

    def set_flag(self, flag):
        self.flag = flag

    def set_url_web(self, url_web):
        self.url_web = url_web

    def indexar_site(self):
        sql = f"INSERT INTO indexacoes (url_web, path_local, flag) VALUES ('{self.url_web}', '{self.path_local}', {self.flag})"
        self.conexao.execute_sql(sql)

    def retornar_id_index(self, url):
        sql = f"SELECT id FROM indexacoes WHERE url_web = '{url}'"
        resultado = self.conexao.fetch_result(sql)
        return resultado[0][0] if resultado else None

from conexao import Conexao

class Indexacoes:
    def __init__(self):
        self.con = Conexao()
        self.id_index = None
        self.pathLocal = None
        self.flag = None
        self.indexacao = None
        self.urlWeb = None

    def get_id_index(self):
        return self.id_index

    def set_id_index(self, id_index):
        self.id_index = id_index

    def get_pathLocal(self):
        return self.pathLocal

    def set_pathLocal(self, pathLocal):
        self.pathLocal = pathLocal

    def is_flag(self):
        return self.flag

    def set_flag(self, flag):
        self.flag = flag

    def get_indexacao(self):
        return self.indexacao

    def set_indexacao(self, indexacao):
        self.indexacao = indexacao

    def get_urlWeb(self):
        return self.urlWeb

    def set_urlWeb(self, urlWeb):
        self.urlWeb = urlWeb

    def indexar_site(self):
        sql = f"INSERT INTO indexacoes (pathLocal, flag, urlWeb) VALUES ('{self.pathLocal}', 1, '{self.urlWeb}')"
        self.con.execute_sql(sql)

    def pesquisar(self, site):
        sql = f"SELECT pathLocal FROM indexacoes WHERE urlWeb = '{site}'"
        results = self.con.fetch_result(sql)
        return len(results) > 0

    def retornar_id_index(self, site):
        sql = f"SELECT id_index FROM indexacoes WHERE urlWeb = '{site}'"
        results = self.con.fetch_result(sql)
        return results[0][0] if results else None

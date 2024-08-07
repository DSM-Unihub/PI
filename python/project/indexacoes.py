from conexao import Conexao

class Indexacoes:
    def __init__(self):
        # Inicializa uma instância da classe Conexao para interagir com o banco de dados.
        self.conexao = Conexao()

    def pesquisar(self, url):
        # Pesquisa a tabela 'indexacoes' para verificar se a URL já está indexada.
        # Utiliza uma consulta SQL para contar o número de registros com a URL fornecida.
        sql = f"SELECT COUNT(*) FROM indexacoes WHERE urlWeb = '{url}'"
        resultado = self.conexao.fetch_result(sql)
        # Retorna True se o resultado for maior que 0, indicando que a URL já está indexada.
        return resultado[0][0] > 0 if resultado else False

    def set_pathLocal(self, pathLocal):
        # Define o atributo pathLocal da instância.
        self.pathLocal = pathLocal

    def set_flag(self, flag):
        # Define o atributo flag da instância.
        self.flag = flag

    def set_urlWeb(self, urlWeb):
        # Define o atributo urlWeb da instância.
        self.urlWeb = urlWeb

    def indexar_site(self):
        # Insere um novo registro na tabela 'indexacoes' com os dados fornecidos.
        # A URL, caminho local e flag são passados como valores na consulta SQL.
        sql = f"INSERT INTO indexacoes (urlWeb, pathLocal, flag) VALUES ('{self.urlWeb}', '{self.pathLocal}', {self.flag})"
        self.conexao.execute_sql(sql)

    def retornar_id_index(self, url):
        # Recupera o ID do índice para uma URL específica da tabela 'indexacoes'.
        # Utiliza uma consulta SQL para selecionar o id_index da URL fornecida.
        sql = f"SELECT id_index FROM indexacoes WHERE urlWeb = '{url}'"
        resultado = self.conexao.fetch_result(sql)
        # Retorna o ID se o resultado for encontrado, ou None se não houver resultado.
        return resultado[0][0] if resultado else None

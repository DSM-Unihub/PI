from conexao import Conexao

# Classe que gerencia as operações de indexação de URLs no banco de dados.
class Indexacoes:
    def __init__(self):
        # Inicializa uma instância da classe Conexao para interagir com o banco de dados.
        # Isso permitirá fazer consultas e inserções no banco de dados.
        self.conexao = Conexao()

    def pesquisar(self, url):
        # Pesquisa a tabela 'indexacoes' para verificar se a URL já está indexada.
        # Utiliza uma consulta SQL para contar o número de registros com a URL fornecida.
        sql = f"SELECT COUNT(*) FROM indexacoes WHERE urlWeb = '{url}'"
        resultado = self.conexao.fetch_result(sql)  # Executa a consulta e retorna o resultado.
        # Retorna True se o resultado for maior que 0, indicando que a URL já está indexada.
        # Caso não haja resultado, retorna False.
        return resultado[0][0] > 0 if resultado else False

    def set_pathLocal(self, pathLocal):
        # Define o atributo pathLocal da instância, que representa o caminho local do site indexado.
        self.pathLocal = pathLocal

    def set_flag(self, flag):
        # Define o atributo flag da instância.
        # A flag pode representar o status ou qualquer outra característica do site indexado.
        self.flag = flag

    def set_urlWeb(self, urlWeb):
        # Define o atributo urlWeb da instância, que será a URL a ser indexada.
        self.urlWeb = urlWeb

    def indexar_site(self):
        # Insere um novo registro na tabela 'indexacoes' com os dados fornecidos (URL, caminho local e flag).
        sql = f"INSERT INTO indexacoes (urlWeb, pathLocal, flag) VALUES ('{self.urlWeb}', '{self.pathLocal}', {self.flag})"
        # Executa a instrução SQL para inserir o novo site no banco de dados.
        self.conexao.execute_sql(sql)

    def retornar_id_index(self, url):
        # Recupera o ID do índice para uma URL específica da tabela 'indexacoes'.
        # Utiliza uma consulta SQL para selecionar o 'id_index' baseado na URL fornecida.
        sql = f"SELECT id_index FROM indexacoes WHERE urlWeb = '{url}'"
        resultado = self.conexao.fetch_result(sql)  # Executa a consulta e retorna o resultado.
        # Retorna o ID se o resultado for encontrado, ou None se não houver resultado.
        return resultado[0][0] if resultado else None

from conexao import Conexao

class Acessos:
    def __init__(self):
        # Inicializa uma instância de Conexao ao criar um objeto da classe Acessos.
        self.conexao = Conexao()

    def set_url(self, url):
        # Define o atributo url da instância.
        self.url = url

    def set_data_hora(self, data_hora):
        # Define o atributo data_hora da instância.
        self.data_hora = data_hora

    def set_ip_maquina(self, ip_maquina):
        # Define o atributo ip_maquina da instância.
        self.ip_maquina = ip_maquina

    def set_id_index_fk(self, id_index_fk):
        # Define o atributo id_index_fk da instância.
        self.id_index_fk = id_index_fk

    def cadastrar(self):
        # Cria a string SQL para inserir um novo registro na tabela acessos.
        sql = f"""
        INSERT INTO acessos (data_hora, ip_maquina, urlWeb, id_index, idInstituicao)
        VALUES ('{self.data_hora}', '{self.ip_maquina}', '{self.url}', {self.id_index_fk}, 1)
        """
        # Executa a consulta SQL usando o método execute_sql da conexão.
        self.conexao.execute_sql(sql)

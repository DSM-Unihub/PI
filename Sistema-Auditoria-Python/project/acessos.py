from conexao import Conexao

# Classe que representa o gerenciamento de acessos, com operações de inserção no banco de dados.
class Acessos:
    def __init__(self):
        # Inicializa uma instância de Conexao ao criar um objeto da classe Acessos.
        # Isso permite interagir com o banco de dados.
        self.conexao = Conexao()

    def set_url(self, url):
        # Define o atributo url da instância.
        # Este método armazena a URL que será inserida no banco de dados.
        self.url = url

    def set_data_hora(self, data_hora):
        # Define o atributo data_hora da instância.
        # O valor de data e hora do acesso será armazenado aqui.
        self.data_hora = data_hora

    def set_ip_maquina(self, ip_maquina):
        # Define o atributo ip_maquina da instância.
        # O endereço IP da máquina que fez o acesso será registrado nesse atributo.
        self.ip_maquina = ip_maquina

    def set_id_index_fk(self, id_index_fk):
        # Define o atributo id_index_fk da instância.
        # O ID da chave estrangeira referente ao índice será armazenado aqui.
        self.id_index_fk = id_index_fk

    def cadastrar(self):
        # Cria a string SQL para inserir um novo registro na tabela acessos.
        # Os dados armazenados nos atributos da instância são usados para compor a consulta SQL.
        sql = f"""
        INSERT INTO acessos (data_hora, ip_maquina, urlWeb, id_index, idInstituicao)
        VALUES ('{self.data_hora}', '{self.ip_maquina}', '{self.url}', {self.id_index_fk}, 1)
        """
        # Executa a consulta SQL usando o método execute_sql da conexão.
        # O registro é inserido no banco de dados através da conexão previamente inicializada.
        self.conexao.execute_sql(sql)

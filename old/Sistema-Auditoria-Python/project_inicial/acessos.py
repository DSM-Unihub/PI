from conexao import Conexao
from datetime import datetime

class Acessos:
    def __init__(self):
        # Inicializa uma instância de ConexaoMongoDB ao criar um objeto da classe Acessos.
        # Isso permite interagir com o banco de dados MongoDB.
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

    def cadastrar(self):
        if isinstance(self.data_hora, str):
            data_hora_obj = datetime.strptime(self.data_hora, '%Y-%m-%d %H:%M:%S')
        else:
            data_hora_obj = self.data_hora

        self.conexao.insert_document(
            'acessos',
            self.ip_maquina,
            self.url,
            data_hora_obj,
            True,
            'Automatico'
        )

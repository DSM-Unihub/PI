import mysql.connector

class Conexao:
    def __init__(self):
        # Estabelece uma conexão com o banco de dados MySQL usando as credenciais fornecidas.
        self.conn = mysql.connector.connect(
            host='127.0.0.1',         # Endereço do servidor MySQL
            #port='3307',            # Comentado; porta padrão é 3306 se não especificada
            user='root',              # Usuário do banco de dados
            password='',              # Senha do usuário do banco de dados (vazia aqui)
            database='resistBD'       # Nome do banco de dados
        )
        # Cria um cursor para executar comandos SQL.
        self.cursor = self.conn.cursor()

    def execute_sql(self, sql):
        # Executa um comando SQL e faz o commit das alterações no banco de dados.
        try:
            self.cursor.execute(sql)
            self.conn.commit()
        except mysql.connector.Error as e:
            # Captura e imprime erros que ocorrem ao executar o SQL.
            print(f"Erro ao executar SQL: {e}")

    def fetch_result(self, sql):
        # Executa uma consulta SQL e retorna todos os resultados.
        try:
            self.cursor.execute(sql)
            return self.cursor.fetchall()
        except mysql.connector.Error as e:
            # Captura e imprime erros que ocorrem ao buscar resultados.
            print(f"Erro ao buscar resultado: {e}")
            return []

    def close(self):
        # Fecha o cursor e a conexão com o banco de dados.
        self.cursor.close()
        self.conn.close()

import mysql.connector

# Classe responsável por gerenciar a conexão com o banco de dados MySQL.
class Conexao:
    def __init__(self):
        # Estabelece uma conexão com o banco de dados MySQL usando as credenciais fornecidas.
        self.conn = mysql.connector.connect(
            host='127.0.0.1',         # Endereço do servidor MySQL (localhost neste caso)
            #port='3307',            # Comentado; porta padrão é 3306 se não especificada
            user='root',              # Usuário do banco de dados, aqui configurado como 'root'.
            password='',              # Senha do usuário do banco de dados (vazia neste exemplo).
            database='resistBD'       # Nome do banco de dados ao qual estamos nos conectando.
        )
        # Cria um cursor para executar comandos SQL.
        # O cursor é necessário para enviar comandos SQL e processar resultados.
        self.cursor = self.conn.cursor()

    def execute_sql(self, sql):
        # Executa um comando SQL (INSERT, UPDATE, DELETE) e faz o commit das alterações no banco de dados.
        try:
            self.cursor.execute(sql)   # Envia a instrução SQL para o banco de dados.
            self.conn.commit()         # Salva as alterações no banco de dados.
        except mysql.connector.Error as e:
            # Captura e imprime erros que ocorrem ao executar o SQL.
            # Útil para depuração de falhas no comando SQL.
            print(f"Erro ao executar SQL: {e}")

    def fetch_result(self, sql):
        # Executa uma consulta SQL (SELECT) e retorna todos os resultados.
        try:
            self.cursor.execute(sql)   # Envia a consulta SQL para o banco de dados.
            return self.cursor.fetchall()  # Retorna todos os resultados da consulta.
        except mysql.connector.Error as e:
            # Captura e imprime erros que ocorrem ao buscar resultados.
            print(f"Erro ao buscar resultado: {e}")
            return []  # Retorna uma lista vazia em caso de erro.

    def close(self):
        # Fecha o cursor e a conexão com o banco de dados.
        # Importante para liberar recursos e encerrar a conexão corretamente.
        self.cursor.close()  # Fecha o cursor.
        self.conn.close()    # Fecha a conexão com o banco de dados.

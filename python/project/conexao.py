import mysql.connector

class Conexao:
    def __init__(self):
        self.conn = mysql.connector.connect(
            host='127.0.0.1',
            port= '3307',
            user='root',
            password='',
            database='resistBD'
        )
        self.cursor = self.conn.cursor()

    def execute_sql(self, sql):
        try:
            self.cursor.execute(sql)
            self.conn.commit()
        except mysql.connector.Error as e:
            print(f"Erro ao executar SQL: {e}")

    def fetch_result(self, sql):
        try:
            self.cursor.execute(sql)
            return self.cursor.fetchall()
        except mysql.connector.Error as e:
            print(f"Erro ao buscar resultado: {e}")
            return []

    def close(self):
        self.cursor.close()
        self.conn.close()

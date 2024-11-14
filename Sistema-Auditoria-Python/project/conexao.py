from pymongo import MongoClient
from datetime import datetime

# Classe responsável por gerenciar a conexão com o banco de dados MongoDB.
class Conexao:
    def __init__(self):
        # URL de conexão para o MongoDB Atlas. Substitua com as suas credenciais e URL.
        self.client = MongoClient("mongodb+srv://mandiradaniel:admin@auladw3.qpo0l.mongodb.net/resist?retryWrites=true&w=majority&appName=AulaDW3")
        
        # Seleciona o banco de dados
        self.db = self.client['resist']  # Substitua 'resistBD' pelo nome do seu banco de dados.

    def insert_document(self, collection_name, ipMaquina, urlWeb, dataHora, flag, tipoInsercao):
        # Insere um documento na coleção especificada com os dados fornecidos.
        try:
            collection = self.db[collection_name]
            document = {
                "ipMaquina": ipMaquina,
                "urlWeb": urlWeb,
                "dataHora": dataHora,
                "flag": flag,
                "tipoInsercao": tipoInsercao
            }
            result = collection.insert_one(document)  # Insere o documento e retorna o ID do documento.
            print(f"Documento inserido com ID: {result.inserted_id}")
        except Exception as e:
            print(f"Erro ao inserir documento: {e}")

    def fetch_results(self, collection_name, query={}):
        # Executa uma consulta na coleção especificada e retorna todos os documentos que correspondem ao filtro.
        try:
            collection = self.db[collection_name]
            return list(collection.find(query))  # Retorna todos os documentos que correspondem à consulta.
        except Exception as e:
            print(f"Erro ao buscar resultado: {e}")
            return []  # Retorna uma lista vazia em caso de erro.

    def close(self):
        # Fecha a conexão com o MongoDB Atlas.
        self.client.close()

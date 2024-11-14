from pymongo import MongoClient, UpdateOne

class Indexacoes:
    def __init__(self, db):
        self.db = db

    def is_site_indexed(self, url):
        """Verifica se o site já foi indexado no banco de dados"""
        try:
            # Exemplo de consulta ao banco de dados
            result = self.db['indexacoes'].find_one({"urlWeb": url})
            return result is not None  # Se encontrar a URL, o site foi indexado
        except Exception as e:
            print(f"Erro ao verificar indexação do site: {e}")
            return False

    def indexar_sites_em_lote(self, dados_site):
        """Indexar vários sites em lote para melhorar a performance"""
        bulk_operations = []
        for dado in dados_site:
            # Exemplo de operação em lote
            bulk_operations.append(
                UpdateOne(
                    {"urlWeb": dado['urlWeb']},
                    {"$set": dado},
                    upsert=True  # Se o site não existir, insere um novo documento
                )
            )

        if bulk_operations:
            try:
                self.db['indexacoes'].bulk_write(bulk_operations)
                print("Sites indexados com sucesso em lote.")
            except Exception as e:
                print(f"Erro ao indexar sites em lote: {e}")

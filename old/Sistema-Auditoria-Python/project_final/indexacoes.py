class Indexacoes:
    def __init__(self, db):
        self.db = db

    def is_site_indexed(self, url):
        try:
            return self.db['indexacoes'].find_one({"urlWeb": url}) is not None
        except Exception as e:
            print(f"Erro ao verificar indexação do site: {e}")
            return False

    def buscar_site_por_url(self, url):
        # Buscar a URL na coleção de indexações
        site = self.db['indexacoes'].find_one({"urlWeb": url})
        return site
    
    
    def indexar_site(self, dados_site):
        try:
            self.db['indexacoes'].update_one(
                {"urlWeb": dados_site['urlWeb']},
                {"$set": dados_site},
                upsert=True
            )
        except Exception as e:
            print(f"Erro ao indexar site: {e}")
        
        

class Acessos:
    def __init__(self, db):
        self.db = db

    def registrar_acesso(self, dados_acesso):
        try:
            self.db['acessos'].insert_one(dados_acesso)
        except Exception as e:
            print(f"Erro ao registrar acesso: {e}")
    
    def save_access(self, dados_acesso):
        try:
            self.db['acessos'].insert_one(dados_acesso)
            print(f"Acesso salvo com sucesso para URL: {dados_acesso['urlWeb']}")
        except Exception as e:
            print(f"Erro ao salvar acesso: {e}")
            
    

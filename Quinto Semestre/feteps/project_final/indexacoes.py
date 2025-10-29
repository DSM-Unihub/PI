import requests
import os

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
    
    
    def atualizar_indexacao(self, urlWeb, dados_atualizados):
        api_put_url = os.getenv('/API_URL', 'http://localhost:4000/api/bloqueios')
        api_get_by_url = os.getenv('/API_URL', 'http://localhost:4000/api/bloqueios/url')
        api_token = os.getenv('API_TOKEN')

        if not api_token:
            print("Erro: API_TOKEN não definido no ambiente.")
            return
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
        payload = {
            "url": dados_atualizados.get("PathLocal"), # Usando PathLocal como 'url' para a API
            "urlWeb": dados_atualizados.get("urlWeb"),
            "motivo": "Indexado Automaticamente",
            "tipoInsercao": dados_atualizados.get("tipoInsercao", "Automatico"),
            "ipMaquina": dados_atualizados.get("ipMaquina"),
            "flag": dados_atualizados.get("flag", False) # API espera booleano
        }

        try:
            response = requests.get(api_get_by_url, headers=headers)
            response.raise_for_status() 
            id_indexacao = response.json().get('_id')

            try:
                response_put = requests.put(f"{api_put_url}/{id_indexacao}", headers=headers, json=payload)
                response_put.raise_for_status()
                print(f"Site {dados_atualizados['urlWeb']} indexado com sucesso via API.")
            except:
                print("ID não encontrado para atualização.")
                return
        except Exception as e:
            print(f"Erro ao buscar indexação do site: {e}")

    def indexar_site(self, dados_site):
        # URL do endpoint da API para criar um bloqueio
        api_url = os.getenv('/API_URL', 'http://localhost:4000/api/bloqueios')
        api_token = os.getenv('API_TOKEN')

        if not api_token:
            print("Erro: API_TOKEN não definido no ambiente.")
            return

        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }

        # O campo 'url' é obrigatório pela API, o resto é opcional
        payload = {
            "url": dados_site.get("PathLocal"), # Usando PathLocal como 'url' para a API
            "urlWeb": dados_site.get("urlWeb"),
            "motivo": "Indexado Automaticamente",
            "tipoInsercao": dados_site.get("tipoInsercao", "Automatico"),
            "ipMaquina": dados_site.get("ipMaquina"),
            "flag": dados_site.get("flag", False) # API espera booleano
        }

        try:
            # self.db['indexacoes'].update_one(
            #     {"urlWeb": dados_site['urlWeb']},
            #     {"$set": dados_site},
            #     upsert=True
            # )
            response = requests.post(api_url, headers=headers, json=payload)
            response.raise_for_status()  # Lança exceção para respostas de erro (4xx ou 5xx)
            print(f"Site {dados_site['urlWeb']} indexado com sucesso via API.")
        except Exception as e:
            print(f"Erro ao indexar site: {e}")
            print(f"Erro ao indexar site via API: {e}")
        
        

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
            
    
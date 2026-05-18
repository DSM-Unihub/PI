import requests
import os

class Indexacoes:
    def __init__(self, db):
        self.db = db

    def _api_base(self):
        return os.getenv("API_URL", "http://localhost:4000/api").rstrip("/")

    def _api_headers(self):
        api_token = os.getenv('API_TOKEN')
        if not api_token:
            return None
        return {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }

    def lookup_indexacao(self, url):
        """Busca indexação por URL com normalização da API."""
        headers = self._api_headers()
        if headers is None:
            return None
        api_lookup_url = f"{self._api_base()}/bloqueios/lookup"
        try:
            response = requests.get(api_lookup_url, headers=headers, params={"url": url})
            response.raise_for_status()
            return response.json().get('data')
        except Exception:
            return None

    def normalize_frases(self, frases):
        if not isinstance(frases, list):
            return []
        normalizadas = []
        for item in frases:
            if isinstance(item, str):
                texto = item.strip()
                if texto:
                    normalizadas.append({
                        "texto": texto,
                        "ofensiva": True,
                        "motivo": None,
                        "label": None,
                        "score": None,
                    })
            elif isinstance(item, dict):
                texto = str(item.get("texto") or "").strip()
                if texto:
                    motivo = item.get("motivo") or item.get("label")
                    score = item.get("score")
                    normalizadas.append({
                        "texto": texto,
                        "ofensiva": bool(item.get("ofensiva", True)),
                        "motivo": str(motivo).strip() if motivo else None,
                        "label": str(item.get("label")).strip() if item.get("label") else (str(motivo).strip() if motivo else None),
                        "score": float(score) if isinstance(score, (int, float)) else None,
                    })
        return normalizadas

    def is_site_indexed(self, url):
        try:
            if self.lookup_indexacao(url):
                return True
            return self.db['indexacoes'].find_one({"urlWeb": url}) is not None
        except Exception as e:
            #print(f"Erro ao verificar indexação do site: {e}")
            return False

    def buscar_site_por_url(self, url):
        site = self.lookup_indexacao(url)
        if site:
            return site
        return self.db['indexacoes'].find_one({"urlWeb": url})
    
    
    def atualizar_indexacao(self, urlWeb, dados_atualizados):
        # Não usar GET .../bloqueios/url/{urlWeb}: no Express, :url captura só um
        # segmento; caminhos como host/foo/bar viram 404. O lookup com ?url= aceita a URL inteira.
        api_put_url = f"{self._api_base()}/bloqueios"
        api_token = os.getenv('API_TOKEN')

        if not api_token:
            #print("Erro: API_TOKEN não definido no ambiente.")
            return
        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
        

        try:
            data = self.lookup_indexacao(urlWeb)
            if not data:
                return
            id_indexacao = data.get('_id')
            if isinstance(id_indexacao, dict) and "$oid" in id_indexacao:
                id_indexacao = id_indexacao["$oid"]
            elif id_indexacao is not None:
                id_indexacao = str(id_indexacao)
            if not id_indexacao:
                return
            #print(f"ID da indexação encontrada: {id_indexacao}")

            payload = {
                "url": dados_atualizados.get("PathLocal"), # Usando PathLocal como 'url' para a API
                "motivo": dados_atualizados.get("motivo", "Indexado Automaticamente"),
                "frases": self.normalize_frases(dados_atualizados.get("frases", [])),
                "flag": dados_atualizados.get("flag", False) # API espera booleano
            }
            # #print(response.json())
            try:
                response_put = requests.put(f"{api_put_url}/{id_indexacao}", headers=headers, json=payload)
                response_put.raise_for_status()
                #print(f"Site {dados_atualizados['urlWeb']} atualizado com sucesso via API.")
            except:
                #print("ID não encontrado para atualização.")
                return
        except Exception as e:
            print(f"Erro ao buscar indexação do site: {e}")

    def indexar_site(self, dados_site):
        # URL do endpoint da API para criar um bloqueio
        api_url = f"{self._api_base()}/bloqueios"
        api_token = os.getenv('API_TOKEN')

        if not api_token:
            #print("Erro: API_TOKEN não definido no ambiente.")
            return

        headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }

        # O campo 'url' é obrigatório pela API, o resto é opcional
        payload = {
            "url": dados_site.get("PathLocal"), # Usando PathLocal como 'url' para a API
            "urlWeb": dados_site.get("urlWeb"),
            "motivo": dados_site.get("motivo", "Indexado Automaticamente"),
            "frases": self.normalize_frases(dados_site.get("frases", [])),
            "tipoInsercao": dados_site.get("tipoInsercao", "Automatico"),
            "ipMaquina": dados_site.get("ipMaquina"),
            "flag": dados_site.get("flag", False) # API espera booleano
        }
        nav_id = dados_site.get("navId")
        if nav_id:
            payload["navId"] = nav_id

        try:
            # self.db['indexacoes'].update_one(
            #     {"urlWeb": dados_site['urlWeb']},
            #     {"$set": dados_site},
            #     upsert=True
            # )
            response = requests.post(api_url, headers=headers, json=payload)
            response.raise_for_status()  # Lança exceção para respostas de erro (4xx ou 5xx)
            # #print(f"Site {dados_site['urlWeb']} indexado com sucesso via API.")
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
            #print(f"Acesso salvo com sucesso para URL: {dados_acesso['urlWeb']}")
        except Exception as e:
            print(f"Erro ao salvar acesso: {e}")
            
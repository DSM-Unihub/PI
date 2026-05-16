import re
import os
from datetime import datetime
import requests
import hmac
import json
import hashlib
import time
# no topo de bloqueio.py
from crypto_utils import decrypt_from_file

from dotenv import load_dotenv

load_dotenv()


class Bloqueio:
    def __init__(self, arm_file_path, html_directory, bloqueados_file_path=os.getenv('BLOQUEADOS_FILE_PATH')):
        self.arm_file_path = arm_file_path
        self.html_directory = html_directory
        self.bloqueados_file_path = bloqueados_file_path
        self.secret_key = os.getenv('API_SECRET_KEY')
        

    def ler_arm_file(self):
        """Lê o arquivo arm.txt e retorna uma lista de URLs."""
        with open(self.arm_file_path, 'r') as file:
            return [line.strip() for line in file]

    def extrair_url_do_arquivo(self, caminho_arquivo):
        """Extrai a URL do site a partir do conteúdo do arquivo, removendo as tags <urlDoSite>."""
        try:
            data = decrypt_from_file(caminho_arquivo)
            conteudo = data.decode("utf-8", errors="replace")
            tag_inicio = '<urlDoSite>'
            tag_fim = '</urlDoSite>'
            inicio = conteudo.find(tag_inicio)
            fim = conteudo.find(tag_fim)
            if inicio != -1 and fim != -1:
                url = conteudo[inicio + len(tag_inicio):fim]
                return url.strip()
             # fallback: se não achar a tag, tenta extrair por regex ou retorna todo o conteúdo do início
            return None
        except Exception as e:
            print(f"Erro ao extrair URL do arquivo (descriptografia falhou?): {e}")
        
        return None 
    import re

    def segmentar_texto(self, conteudo: str):
        # 1. Normalize and clean up whitespace.
        conteudo = re.sub(r'\s+', ' ', conteudo).strip()
        
        # 2. Split the content into potential blocks based on common web patterns.
        # We use '|' to find either bracketed text OR a common phrase separator.
        # The non-capturing group (?:...) is used to find, but not return, the separators.
        # This keeps the logic cleaner later on.
        separators = r'(\[.*?\])|(?:\.\.\.)|(?:\s---)|\n+|(?<=[.!?])\s+|(?<=Read more:)|(?<=Related Articles →)'
        blocos = re.split(separators, conteudo)
        
        frases_finais = []
        
        for bloco in blocos:
            if not bloco or not bloco.strip():
                continue
                
            bloco = bloco.strip()
            
            # If the block is a bracketed phrase, treat it as a single unit.
            if bloco.startswith('[') and bloco.endswith(']'):
                frases_finais.append(bloco)
            # If it's a URL or common "junk" phrase, keep it separate.
            elif "http" in bloco or ".com" in bloco or "Advertisement" in bloco or "Join our" in bloco:
                frases_finais.append(bloco)
            # Otherwise, assume it's regular text and process it.
            else:
                # Re-split the block into sentences based on punctuation.
                sentencas = re.split(r'(?<=[.!?])\s+', bloco)
                for sentenca in sentencas:
                    if sentenca.strip():
                        frases_finais.append(sentenca.strip())

        # Filter out short or junk phrases that might have been created.
        # This helps improve the quality of what is sent to the AI.
        return [f for f in frases_finais if len(f.split()) > 3]

    def enviar_para_modelo(self, frase: str):
        """
        Envia uma frase para o modelo de verificação de preconceito.
        Retorna a lista de classificações (label + score).
        """
        url = "http://127.0.0.1:5000/verificar"
        payload = {"texto": frase}
        json_data = json.dumps(payload)
        timestamp = str(int(time.time()))

             # Criar token de autenticação
        message = f"{timestamp}:{json_data}"
        auth_token = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
             # Criar token de autenticação
        message = f"{timestamp}:{json_data}"
        auth_token = hmac.new(
            self.secret_key.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()

        
        # Headers com autenticação
        headers = {
            'Content-Type': 'application/json',
            'X-Auth-Token': auth_token,
            'X-Timestamp': timestamp
        }

        print("----")
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 401:
                print("[ERRO] Falha na autenticação com o endpoint")
                return []
            
            response.raise_for_status()  # dispara erro se não for 200
            return response.json()  # deve ser a lista de {label, score}
        except requests.exceptions.RequestException as e:
            print(f"[ERRO] Falha ao conectar ao modelo: {e}")
            return []

    def verificar_html(self, hash_nome):
        """
        Verifica se há conteúdo preconceituoso no arquivo HTML correspondente.
        Retorna um dicionário com status e detalhes.
        """
        # pra linux
        # caminho_html = os.path.join(self.html_directory, f"{hash_nome}.txt") 
        # pra windows
        # caminho_html = os.path.join(self.html_directory, f"{hash_nome}.txt").replace('\\','/')
        caminho_html = os.path.join(self.html_directory, f"{hash_nome}.enc").replace('\\','/')
        print
        if os.path.exists(caminho_html):
            url = self.extrair_url_do_arquivo(caminho_html)
            print(caminho_html)
            print(url)
            if not url:
                return {"bloquear": False, "motivo": "Nao existe", "frase": None}
                
            try:
                conteudo_bytes = decrypt_from_file(caminho_html)
                conteudo = conteudo_bytes.decode("utf-8", errors="replace")
            except Exception as e:
                print(f"Erro ao descriptografar o arquivo {caminho_html}: {e}")
                return {"bloquear": False, "motivo": "Descriptografia falhou", "frase": None}
            
            frases = self.segmentar_texto(conteudo)
                
            for frase in frases:
                print(f" - frase sendo analisada: '{frase}'")
                resultados = self.enviar_para_modelo(frase)  # lista de dicts
                if not resultados:
                    continue
                melhor = max(resultados, key=lambda r: r["score"])
                    
                if melhor["label"] != "Appropriate" and melhor["score"] > 0.5:
                    return {
                        "motivo": melhor["label"],
                        "bloquear": True,
                        "score": melhor["score"],
                        "frase": frase.strip()
                    }
        else:
            print("Arquivo não encontrado", caminho_html)
         # se não encontrou nada tóxico
        return {"bloquear": False, "motivo": None, "frase": None}


    def url_ja_bloqueada(self, url):
        """Verifica se a URL já existe no arquivo bloqueados.txt"""
        try:
            if not os.path.exists(self.bloqueados_file_path):
                return False
                
            with open(self.bloqueados_file_path, 'r') as bloqueados_file:
                urls_bloqueadas = [line.strip() for line in bloqueados_file.readlines()]
                return url in urls_bloqueadas
        except Exception as e:
            print(f"Erro ao verificar URLs bloqueadas: {e}")
            return False

    def criar_registro_bloqueado(self, url):
        """Cria um novo registro no arquivo bloqueados.txt com a URL completa, evitando duplicatas"""
        # Remove possíveis tags <urlDoSite> e </urlDoSite>
        url_bloqueio = url.replace('<urlDoSite>', '').replace('</urlDoSite>', '').strip()

        # Remove a porta 443, se existir
        url_bloqueio = url_bloqueio.replace(":443", "")

        if self.url_ja_bloqueada(url_bloqueio):
            print(f"URL {url_bloqueio} já está na lista de bloqueados. Ignorando.")
            return

        with open(self.bloqueados_file_path, 'a') as bloqueados_file:
            bloqueados_file.write(f"{url_bloqueio}\n")
        print(f"URL {url_bloqueio} adicionada ao arquivo de bloqueados.")

    def bloquear_sites(self, nome_arquivo):
        """Bloqueia sites somente se a flag 'bloquear' for True."""
        # if nome_arquivo in os.listdir(self.html_directory):
        print("~~~~iniciando teste de bloqueio")
        if nome_arquivo.endswith('.txt') or nome_arquivo.endswith('.enc'):
            print("é txt!")
            hash_nome = nome_arquivo[:-4]
            resultado = self.verificar_html(hash_nome)  # retorna dict
            print("-> resultado da i.a: ", resultado)
            if resultado.get("bloquear"):
                url = self.extrair_url_do_arquivo(os.path.join(self.html_directory, nome_arquivo))
                if url:
                    print(f"Bloqueando {url} - Motivo: {resultado.get('motivo')} | Score: {resultado.get('score')}")
                    self.criar_registro_bloqueado(url)
                    return "bloqueado"
                else:
                    print("Não tenho pq bloquear essa página")
                    return "naobloqueado"
            
            else:
                print("Conteúdo apropriado, não bloqueado.")
                return "naobloqueado"
            
    def imprimir_conteudo_html(self, url):
        """Imprime o conteúdo do arquivo HTML correspondente à URL."""
        import hashlib
        hash_nome = hashlib.md5(url.encode()).hexdigest()
        caminho_html = os.path.join(self.html_directory, f"{hash_nome}.txt")

        if os.path.exists(caminho_html):
            with open(caminho_html, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                print(f"Conteúdo de {url}:\n{conteudo}")
        else:
            print(f"O arquivo HTML para {url} não existe.")

def main():
    bloqueio = Bloqueio(
        arm_file_path=os.getenv('ARM_FILE_PATH'),
        html_directory=os.getenv('HTML_DUMPS_DIR'),
        bloqueados_file_path=os.getenv('BLOQUEADOS_FILE_PATH')
    )
    bloqueio.bloquear_sites()

if __name__ == "__main__":
    main()
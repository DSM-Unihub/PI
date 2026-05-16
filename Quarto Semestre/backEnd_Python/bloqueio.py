import os
from datetime import datetime

class Bloqueio:
    def __init__(self, arm_file_path, html_directory):
        self.arm_file_path = arm_file_path
        self.html_directory = html_directory
        self.termo = "corrida"  # Palavra-chave a ser verificada

    def ler_arm_file(self):
        """Lê o arquivo arm.txt e retorna uma lista de URLs."""
        with open(self.arm_file_path, 'r') as file:
            return [line.strip() for line in file]

    def extrair_url_do_arquivo(self, caminho_arquivo):
        """Extrai a URL do site a partir do conteúdo do arquivo, removendo as tags <urlDoSite>."""
        try:
            with open(caminho_arquivo, 'r', encoding='utf-8') as f:
                conteudo = f.read()

                tag_inicio = '<urlDoSite>'
                tag_fim = '</urlDoSite>'

                inicio = conteudo.find(tag_inicio)
                fim = conteudo.find(tag_fim)

                if inicio != -1 and fim != -1:
                    url = conteudo[inicio + len(tag_inicio):fim]
                    return url.strip()
        except Exception as e:
            print(f"Erro ao extrair URL do arquivo: {e}")
        
        return None 

    def verificar_html(self, hash_nome):
        """Verifica se a palavra-chave está presente no arquivo HTML correspondente."""
        caminho_html = os.path.join(self.html_directory, f"{hash_nome}.txt")
        
        if os.path.exists(caminho_html):
            url = self.extrair_url_do_arquivo(caminho_html)
            if not url:
                return False
                
            with open(caminho_html, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                return self.termo in conteudo
        return False

    def url_ja_bloqueada(self, url):
        """Verifica se a URL já existe no arquivo bloqueados.txt"""
        try:
            if not os.path.exists("/root/bloqueados.txt"):
                return False
                
            with open("/root/bloqueados.txt", 'r') as bloqueados_file:
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

        # Ignora URLs que não começam com http:// ou https://
        if not (url_bloqueio.startswith("http://") or url_bloqueio.startswith("https://")):
            print(f"Ignorando URL '{url_bloqueio}' que não começa com http:// ou https://.")
            return

        if self.url_ja_bloqueada(url_bloqueio):
            print(f"URL {url_bloqueio} já está na lista de bloqueados. Ignorando.")
            return

        with open("/root/bloqueados.txt", 'a') as bloqueados_file:
            bloqueados_file.write(f"{url_bloqueio}\n")
        print(f"URL {url_bloqueio} adicionada ao arquivo de bloqueados.")


    def bloquear_sites(self):
        """Bloqueia sites que contêm a palavra-chave no HTML."""
        for nome_arquivo in os.listdir(self.html_directory):
            if nome_arquivo.endswith('.txt'):
                hash_nome = nome_arquivo[:-4]
                if self.verificar_html(hash_nome):
                    url = self.extrair_url_do_arquivo(os.path.join(self.html_directory, nome_arquivo))
                    if url:
                        print(f"Bloqueando {url} por conter a palavra-chave '{self.termo}'.")
                        self.criar_registro_bloqueado(url)

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
    arm_file_path = "/root/arm.txt"
    html_directory = "/home/mauricio/Desktop/html_dumps"
    bloqueio = Bloqueio(arm_file_path, html_directory)
    bloqueio.bloquear_sites()

if __name__ == "__main__":
    main()
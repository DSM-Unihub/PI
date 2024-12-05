# bloqueio.py
import os
from datetime import datetime

class Bloqueio:
    def __init__(self, arm_file_path, html_directory):
        self.arm_file_path = arm_file_path
        self.html_directory = html_directory
        self.termo = "camicado"  # Palavra-chave a ser verificada

    def ler_arm_file(self):
        """Lê o arquivo arm.txt e retorna uma lista de URLs."""
        with open(self.arm_file_path, 'r') as file:
            return [line.strip() for line in file]

    def verificar_html(self, url):
        """Verifica se a palavra-chave está presente no arquivo HTML correspondente."""
        # Formata o nome do arquivo HTML a partir da URL
        nome_arquivo = url.replace("http://", "").replace("https://", "").replace("/", "_").replace(":", "_").replace(".", "_") + ".txt"
        caminho_html = os.path.join(self.html_directory, nome_arquivo)

        if os.path.exists(caminho_html):
            with open(caminho_html, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                return self.termo in conteudo  # Verifica se a palavra-chave está no conteúdo
        return False

    def criar_registro_bloqueado(self, url):
        """Cria um novo registro no arquivo bloqueados.txt com apenas o domínio."""
        # Extrai apenas o domínio da URL
        dominio = url.split('/')[0]  # Pega a parte antes da primeira barra
        if dominio.startswith("http://"):
            dominio = dominio[7:]  # Remove "http://"
        elif dominio.startswith("https://"):
            dominio = dominio[8:]  # Remove "https://"
        
        # Remove a parte da porta se existir
        if ':' in dominio:
            dominio = dominio.split(':')[0]

        with open("C:/Users/bruno/Desktop/pastas_pi/bloqueados.txt", 'a') as bloqueados_file:
            bloqueados_file.write(f"{dominio}\n")  # Escreve apenas o domínio

    def bloquear_sites(self):
        """Bloqueia sites que contêm a palavra-chave no HTML, ignorando URLs que terminam com :433."""
        urls = self.ler_arm_file()
        print(f"URLs lidas do arm.txt: {urls}")

        for url in urls:
            # Ignora URLs que terminam com :433
            if url.endswith(":433"):
                continue
            
            if self.verificar_html(url):
                print(f"Bloqueando {url} por conter a palavra-chave '{self.termo}'.")
                
                # Cria um novo registro com apenas o domínio
                self.criar_registro_bloqueado(url)  # Chama o método atualizado
            else:
                print(f"{url} não contém a palavra-chave '{self.termo}'.")

    def imprimir_conteudo_html(self, url):
        """Imprime o conteúdo do arquivo HTML correspondente à URL."""
        # Formata o nome do arquivo HTML a partir da URL
        nome_arquivo = url.replace("http://", "").replace("https://", "").replace("/", "_").replace(":", "_").replace(".", "_") + ".txt"
        caminho_html = os.path.join(self.html_directory, nome_arquivo)

        if os.path.exists(caminho_html):
            with open(caminho_html, 'r', encoding='utf-8') as f:
                conteudo = f.read()
                print(f"Conteúdo de {url}:\n{conteudo}")
        else:
            print(f"O arquivo HTML para {url} não existe.")

def main():
    arm_file_path = "C:/Users/bruno/Desktop/pastas_pi/arm.txt"
    html_directory = "C:/Users/bruno/Desktop/htmls"  # Ajuste o caminho para o diretório HTML
    bloqueio = Bloqueio(arm_file_path, html_directory)
    bloqueio.bloquear_sites()

if __name__ == "__main__":
    main()
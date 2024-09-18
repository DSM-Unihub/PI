import requests  # Importa a biblioteca requests para fazer requisições HTTP.
from bs4 import BeautifulSoup  # Importa BeautifulSoup para fazer parsing do HTML.
import re  # Importa a biblioteca re para trabalhar com expressões regulares.
import os  # Importa a biblioteca os para interagir com o sistema de arquivos (não está sendo usada atualmente).
from urllib.parse import urlparse  # Importa urlparse para analisar URLs.
from datetime import datetime  # Importa datetime para manipulação de datas e horas.

class TratamentoDados:
    def __init__(self):
        # Inicializa atributos para armazenar informações relacionadas a URL, data e IP.
        self.url = None
        self.data_hora = None
        self.ip_maquina = None

    @staticmethod
    def show_host(site):
        # Extrai e retorna o host (domínio) de uma URL.
        try:
            parsed_url = urlparse(site)  # Analisa a URL e a divide em componentes.
            return parsed_url.netloc  # Retorna o domínio da URL.
        except Exception as e:
            print("Erro ao processar a URL:", e)  # Imprime erro se ocorrer.
            return "ERRO"  # Retorna uma string de erro se falhar.

    @staticmethod
    def load_sites_from_file(position_file_path):
        # Carrega e retorna um conjunto de URLs de um arquivo.
        sites = set()  # Inicializa um conjunto para armazenar URLs.
        try:
            with open(position_file_path, "r") as reader:  # Abre o arquivo para leitura.
                for line in reader:
                    sites.add(line.strip())  # Adiciona cada linha (URL) ao conjunto, removendo espaços em branco.
        except IOError as e:
            print("Erro ao ler o arquivo:", e)  # Imprime erro se ocorrer ao abrir o arquivo.
        return sites  # Retorna o conjunto de URLs.

    @staticmethod
    def remove_port(url):
        # Remove a porta da URL se for ":443" (HTTPS).
        if url.endswith(":443"):  # Verifica se a URL termina com ":443".
            return url[:-4]  # Remove ":443" do final da URL.
        return url  # Retorna a URL original se não tiver ":443".

    @staticmethod
    def extract_site_from_log_line(log_line):
        # Extrai uma URL de uma linha de log. Usa uma expressão regular para encontrar padrões de URL.
        parts = log_line.split()  # Divide a linha de log em partes.
        for part in parts:
            if re.search(r'\.(com|net|org|edu|gov|io|co)', part):  # Procura por padrões de URL.
                return part.replace(":443", "")  # Remove ":443" se estiver presente e retorna a URL.
        return None  # Retorna None se nenhuma URL for encontrada.

    @staticmethod
    def extract_date_from_log_line(log_line):
        # Extrai a data de uma linha de log. Aqui parece estar obtendo o primeiro elemento.
        parts = log_line.split()  # Divide a linha de log em partes.
        if len(parts) >= 4:  # Verifica se há pelo menos 4 partes.
            site_with_port = parts[0]  # Obtém o primeiro elemento.
            return TratamentoDados.remove_port(site_with_port)  # Remove a porta e retorna.
        return None  # Retorna None se não houver data.

    @staticmethod
    def extract_time_from_log_line(log_line):
        # Extrai a hora de uma linha de log. Aqui parece estar obtendo o segundo elemento.
        parts = log_line.split()  # Divide a linha de log em partes.
        if len(parts) >= 4:  # Verifica se há pelo menos 4 partes.
            site_with_port = parts[1]  # Obtém o segundo elemento.
            return TratamentoDados.remove_port(site_with_port)  # Remove a porta e retorna.
        return None  # Retorna None se não houver hora.

    @staticmethod
    def convert_to_mysql_format(input_date):
        # Converte a data no formato específico para o formato MySQL.
        try:
            date = datetime.strptime(input_date, "%Y/%m/%d:%H:%M:%S:%f")  # Converte a string para um objeto datetime.
            return date.strftime("%Y-%m-%d %H:%M:%S")  # Converte o objeto datetime para o formato MySQL.
        except ValueError as e:
            print("Erro ao converter a data:", e)  # Imprime erro se ocorrer ao converter a data.
            return None  # Retorna None se a conversão falhar.

    @staticmethod
    def extract_ip_from_log_line(log_line):
        # Extrai o IP de uma linha de log. Aqui parece estar obtendo o terceiro elemento.
        parts = log_line.split()  # Divide a linha de log em partes.
        if len(parts) >= 4:  # Verifica se há pelo menos 4 partes.
            return parts[2]  # Retorna o terceiro elemento, que é o IP.
        return None  # Retorna None se não houver IP.

    @staticmethod
    def append_site_to_arm_file(position_file_path, site):
        # Adiciona uma URL ao final de um arquivo de posição.
        try:
            with open(position_file_path, "a") as writer:  # Abre o arquivo para escrita em modo de append.
                writer.write(site + "\n")  # Adiciona a URL seguida por uma nova linha.
        except IOError as e:
            print("Erro ao escrever no arquivo:", e)  # Imprime erro se ocorrer ao abrir ou escrever no arquivo.

    @staticmethod
    def extract_html(url):
        # Faz uma solicitação GET para a URL e retorna o HTML da resposta.
        try:
            response = requests.get(url)  # Faz a requisição GET para a URL.
            response.raise_for_status()  # Verifica se a requisição foi bem-sucedida.
            return response.text  # Retorna o conteúdo HTML da resposta.
        except requests.RequestException as e:
            print(f"Erro ao extrair HTML da URL {url}: {e}")  # Imprime erro se ocorrer ao fazer a requisição.
            return None  # Retorna None se a requisição falhar.

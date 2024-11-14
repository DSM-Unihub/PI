import requests  # Importa a biblioteca requests para fazer requisições HTTP.
from bs4 import BeautifulSoup  # Importa BeautifulSoup para fazer parsing do HTML.
import re  # Importa a biblioteca re para trabalhar com expressões regulares.
import os  # Importa a biblioteca os para interagir com o sistema de arquivos (não está sendo usada atualmente).
from urllib.parse import urlparse  # Importa urlparse para analisar URLs.
from datetime import datetime  # Importa datetime para manipulação de datas e horas.

class TratamentoDados:
    def __init__(self):
        self.url = None
        self.data_hora = None
        self.ip_maquina = None

    @staticmethod
    def show_host(site):
        try:
            parsed_url = urlparse(site)
            return parsed_url.netloc
        except Exception as e:
            print("Erro ao processar a URL:", e)
            return "ERRO"

    @staticmethod
    def load_sites_from_file(position_file_path):
        sites = set()
        try:
            with open(position_file_path, "r") as reader:
                for line in reader:
                    sites.add(line.strip())
        except IOError as e:
            print("Erro ao ler o arquivo:", e)
        return sites

    @staticmethod
    def remove_port(url):
        if url.endswith(":443"):
            return url[:-4]
        return url

    @staticmethod
    def extract_site_from_log_line(log_line):
        parts = log_line.split()
        for part in parts:
            if re.search(r'\.(com|net|org|edu|gov|io|co)', part):
                return part.replace(":443", "")
        return None

    @staticmethod
    def extract_date_from_log_line(log_line):
        try:
            match = re.search(r'(\d{4}/\d{2}/\d{2})', log_line)
            return match.group(1) if match else None
        except Exception:
            return None

    @staticmethod
    def extract_time_from_log_line(log_line):
        try:
            match = re.search(r'(\d{2}:\d{2}:\d{2})', log_line)
            return match.group(1) if match else None
        except Exception:
            return None

    @staticmethod
    def convert_to_mysql_format(input_date):
        try:
            date = datetime.strptime(input_date, "%Y/%m/%d:%H:%M:%S")
            return date.strftime("%Y-%m-%d %H:%M:%S")
        except ValueError as e:
            print("Erro ao converter a data:", e)
            return None

    @staticmethod
    def extract_ip_from_log_line(log_line):
        parts = log_line.split()
        if len(parts) >= 4:
            return parts[2]
        return None

    @staticmethod
    def append_site_to_arm_file(position_file_path, site):
        try:
            with open(position_file_path, "a") as writer:
                writer.write(site + "\n")
        except IOError as e:
            print("Erro ao escrever no arquivo:", e)

    @staticmethod
    def extract_html(url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Erro ao extrair HTML da URL {url}: {e}")
            return None

    @staticmethod
    def verificar_flag_no_html(html, palavra_chave):
        """
        Verifica se a palavra-chave está presente no HTML do site.
        
        :param html: O conteúdo HTML do site.
        :param palavra_chave: A palavra-chave a ser verificada no conteúdo HTML.
        :return: Retorna True se a palavra-chave for encontrada, caso contrário, False.
        """
        if html and palavra_chave.lower() in html.lower():  # Ignora maiúsculas/minúsculas
            return True
        return False

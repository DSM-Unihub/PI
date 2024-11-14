from pymongo import MongoClient, UpdateOne
import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urlparse
from datetime import datetime

class TratamentoDados:
    def __init__(self, db):
        self.url = None
        self.data_hora = None
        self.ip_maquina = None
        self.db = db  # Adiciona o banco de dados como atributo

    # Métodos existentes
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
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            print(f"Erro ao extrair HTML da URL {url}: {e}")
            return None
        except Exception as e:
            print(f"Erro inesperado ao extrair HTML: {e}")
            return None

    @staticmethod
    def verificar_flag_no_html(html, palavra_chave):
        if html and palavra_chave.lower() in html.lower():  # Ignora maiúsculas/minúsculas
            return True
        return False

    @staticmethod
    def remove_html_tags(html):
        soup = BeautifulSoup(html, 'html.parser')
        return soup.get_text()

    def store_bloqueado_notification(self, url, mensagem):
    # Envia notificação de bloqueio para o cliente via SSE
        try:
            print(f"Enviando notificação de bloqueio para o URL: {url}")
            response = requests.post("http://127.0.0.1:5000/notify_blocked", json={"url": url, "mensagem": mensagem})
            response.raise_for_status()
            print("Notificação de bloqueio enviada com sucesso.")
        except requests.RequestException as e:
            print(f"Erro ao enviar notificação de bloqueio: {e}")


import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urlparse
from datetime import datetime

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
    def extract_datetime_from_log_line(log_line):
        parts = log_line.split()
        if len(parts) >= 4:
            site_with_port = parts[0]
            return TratamentoDados.remove_port(site_with_port)
        return None

    @staticmethod
    def convert_to_mysql_format(input_date):
        try:
            date = datetime.strptime(input_date, "%d/%b/%Y:%H:%M:%S")
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
        response = requests.get(url)
        response.raise_for_status()
        return response.text

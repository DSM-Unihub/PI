import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from datetime import datetime

class TratamentoDados:
    def __init__(self):
        self.id_acesso = None
        self.data_hora = None
        self.ip_maquina = None
        self.url = None
        self.idCadastro_fk = None
        self.id_index_fk = None

    def get_id_acesso(self):
        return self.id_acesso

    def set_id_acesso(self, id_acesso):
        self.id_acesso = id_acesso

    def get_data_hora(self):
        return self.data_hora

    def set_data_hora(self, data_hora):
        self.data_hora = data_hora

    def get_ip_maquina(self):
        return self.ip_maquina

    def set_ip_maquina(self, ip_maquina):
        self.ip_maquina = ip_maquina

    def get_url(self):
        return self.url

    def set_url(self, url):
        self.url = url

    def get_idCadastro_fk(self):
        return self.idCadastro_fk

    def set_idCadastro_fk(self, idCadastro_fk):
        self.idCadastro_fk = idCadastro_fk

    def get_id_index_fk(self):
        return self.id_index_fk

    def set_id_index_fk(self, id_index_fk):
        self.id_index_fk = id_index_fk

    @staticmethod
    def show_host(site):
        try:
            parsed_url = urlparse(site)
            return parsed_url.hostname
        except Exception as e:
            print(f"Erro: {e}")
            return "ERRO"

    @staticmethod
    def load_sites_from_file(position_file_path):
        sites = set()
        if os.path.exists(position_file_path):
            with open(position_file_path, 'r') as reader:
                for line in reader:
                    sites.add(line.strip())
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
            if any(ext in part for ext in [".com", ".net", ".org", ".edu", ".gov", ".io", ".co"]):
                return part.replace(":443", "")
        return None

    @staticmethod
    def extract_date_time_from_log_line(log_line):
        parts = log_line.split()
        if len(parts) >= 4:
            site_with_port = parts[0]
            return TratamentoDados.remove_port(site_with_port)
        return None

    @staticmethod
    def convert_to_mysql_format(input_date):
        try:
            input_format = "%d/%b/%Y:%H:%M:%S"
            output_format = "%Y-%m-%d %H:%M:%S"
            date_obj = datetime.strptime(input_date, input_format)
            return date_obj.strftime(output_format)
        except ValueError as e:
            print(f"Erro ao converter data: {e}")
            return None

    @staticmethod
    def extract_ip_from_log_line(log_line):
        parts = log_line.split()
        if len(parts) >= 4:
            site_with_port = parts[2]
            return TratamentoDados.remove_port(site_with_port)
        return None

    @staticmethod
    def append_site_to_arm_file(position_file_path, site):
        with open(position_file_path, 'a') as writer:
            writer.write(site + '\n')

    @staticmethod
    def extract_html(url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            return soup.prettify()
        except requests.RequestException as e:
            print(f"Erro ao acessar o site: {e}")
            return None

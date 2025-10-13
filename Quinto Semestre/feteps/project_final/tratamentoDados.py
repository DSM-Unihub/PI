from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urlparse
from datetime import datetime
from playwright.sync_api import sync_playwright


class TratamentoDados:
    def __init__(self, db, html_dir="/home/mauricio/Desktop/html_dumps"):
        self.url = None
        self.data_hora = None
        self.ip_maquina = None
        self.db = db

        # BeautifulSoup parser
        self.parser = 'html.parser'

        # Diretório de HTMLs
        self.html_dir = html_dir
        if not os.path.exists(self.html_dir):
            os.makedirs(self.html_dir)

        # Headers padrão
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }

    # === EXTRAÇÃO DE DADOS DO LOG ===

    @staticmethod
    def extract_site_from_log_line(log_line):
        """Extrai a URL completa (campo 3) da linha do log."""
        parts = log_line.strip().split()
        if len(parts) >= 3:
            return parts[3]
        return None

    def extract_site(self, line):
        """Extrai o domínio da URL (ex: chatgpt.com)."""
        url = self.extract_site_from_log_line(line)
        parsed = urlparse(url)
        return parsed.netloc

    def extract_site_for_arm(self, line):
        """Versão equivalente a extract_site, usada para arm.txt."""
        return self.extract_site(line)

    @staticmethod
    def extract_ip_from_log_line(log_line):
        parts = log_line.strip().split()
        if len(parts) >= 3:
            return parts[2] if re.match(r'\d+\.\d+\.\d+\.\d+', parts[2]) else None
        return None

    @staticmethod
    def extract_date_from_log_line(log_line):
        """Extrai data no formato DD/MM/YYYY."""
        match = re.search(r'(\d{2}/\d{2}/\d{4})', log_line)
        return match.group(1) if match else None

    @staticmethod
    def extract_time_from_log_line(log_line):
        """Extrai hora com milissegundos no formato HH:MM:SS:mmm."""
        match = re.search(r'(\d{2}:\d{2}:\d{2}:\d{3})', log_line)
        return match.group(1) if match else None

    @staticmethod
    def append_site_to_arm_file(position_file_path, site):
        try:
            with open(position_file_path, "a") as writer:
                writer.write(site + "\n")
        except IOError as e:
            print("Erro ao escrever no arquivo:", e)

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

    # === HTML / WEB ===

    def extract_html(self, url):
        """Extrai o HTML da página usando Playwright."""
        print(f"\n=== Iniciando extração de HTML para {url} ===")

        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"http://{url}"
            print(f"URL ajustada para: {url}")

        print("→ Iniciando Playwright...")
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            try:
                print("→ Navegando para a URL...")
                page.goto(url, timeout=60000)
                page.wait_for_load_state('load')
                html = page.content()
                print(f"✓ HTML extraído (Tamanho: {len(html)} caracteres)")
                browser.close()
                return html
            except Exception as e:
                print(f"✗ ERRO: {str(e)} ({e.__class__.__name__})")
                browser.close()
                return None

    def remove_html_tags(self, html):
        """Remove tags HTML e retorna apenas o texto."""
        soup = BeautifulSoup(html, self.parser)
        return soup.get_text()

    def save_html(self, html, url):
        """Salva o HTML como texto em um arquivo local."""
        nome_arquivo = url.replace("http://", "").replace("https://", "").replace("/", "_").replace(":", "_").replace(".", "_")
        caminho_html = os.path.join(self.html_dir, f"{nome_arquivo}.txt")
        with open(caminho_html, 'w', encoding='utf-8') as f:
            f.write(html)
        return caminho_html

    # === BLOQUEIO ===

    def store_bloqueado_notification(self, url, mensagem):
        """Notifica o frontend (SSE) sobre um site bloqueado."""
        try:
            print(f"Enviando notificação de bloqueio para o URL: {url}")
            response = requests.post("http://127.0.0.1:5000/notify_blocked", json={"url": url, "mensagem": mensagem})
            response.raise_for_status()
            print("Notificação enviada com sucesso.")
        except requests.RequestException as e:
            print(f"Erro ao enviar notificação: {e}")

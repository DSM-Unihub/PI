from pymongo import MongoClient, UpdateOne
import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urlparse
from datetime import datetime
from playwright.sync_api import sync_playwright
from queue import Queue, Empty
from threading import Thread, Event

class TratamentoDados:
    def __init__(self, db):
        self.url = None
        self.data_hora = None
        self.ip_maquina = None
        self.db = db
        
        # BeautifulSoup parser
        self.parser = 'html.parser'
        
        # Regex patterns compilados
        self.url_pattern = re.compile(r'\.[a-z]{2,}(:\d+)?', re.IGNORECASE)
        self.protocol_pattern = re.compile(r'^https?://')
        
        # Diretórios
        self.html_dir = r"C:/Users/fatec-dsm4/Desktop/htmls"
        if not os.path.exists(self.html_dir):
            os.makedirs(self.html_dir)
            
        # Headers padrão
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }

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
            if re.search(r'\.[a-z]{2,}', part, re.IGNORECASE):
                return part.replace(":443", "")
        return None
    
    def remove_port_433(url):
        return url.replace(":433", "")
    
    def extract_site(self, line):
        """Usa o regex pattern compilado"""
        parts = line.strip().split()
        for part in parts:
            if self.url_pattern.search(part):
                return TratamentoDados.remove_port_433(part)
        return None

    def extract_site_for_arm(self, line):
    #"""
    #Extrai o domínio principal da linha de log.
    #Exemplo: transforma '03/12/2024 21:53:58:926 192.168.12.2 amazon.com.br:443' em 'amazon.com.br'
    #"""
        match = re.search(r'(\b[a-z0-9.-]+\.com(\.[a-z]{2,3})?\b)', line, re.IGNORECASE)
        if match:
            return match.group(1)  # Retorna o domínio encontrado
        return None  # Retorna None se nenhum domínio válido for encontrado


    @staticmethod
    def extract_date_from_log_line(log_line):
        try:
            # Updated regex to match DD/MM/YYYY format
            match = re.search(r'(\d{2}/\d{2}/\d{4})', log_line)
            return match.group(1) if match else None
        except Exception:
            return None

    @staticmethod
    def extract_time_from_log_line(log_line):
        try:
            # Updated regex to match HH:MM:SS:mmm format
            match = re.search(r'(\d{2}:\d{2}:\d{2}:\d{3})', log_line)
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

    def extract_html(self, url):
        """Usa o parser já inicializado"""
        print(f"\n=== Iniciando extração de HTML para {url} ===")
        
        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"http://{url}"
            print(f"URL ajustada para: {url}")
        
        print("→ Iniciando Playwright...")
        with sync_playwright() as p:
            print("✓ Playwright iniciado")
            browser = p.chromium.launch(headless=False)  # Set headless to False
            print("✓ Navegador lançado")
            page = browser.new_page()
            print("✓ Nova página criada")
            
            try:
                print("→ Navegando para a URL...")
                page.goto(url, timeout=60000)  # Increased timeout
                print("✓ Navegação inicial completa")
                
                print("→ Aguardando carregamento da página...")
                page.wait_for_load_state('load')  # Wait for the page to fully load
                print("✓ Página totalmente carregada")
                
                print("→ Extraindo conteúdo HTML...")
                html = page.content()
                print(f"✓ HTML extraído (Tamanho: {len(html)} caracteres)")
                
                browser.close()
                print("✓ Navegador fechado")
                print("=== Extração concluída com sucesso ===\n")
                return html
                
            except Exception as e:
                print(f"✗ ERRO: {str(e)}")
                print(f"✗ Tipo de erro: {e.__class__.__name__}")
                browser.close()
                print("✗ Navegador fechado após erro")
                print("=== Extração falhou ===\n")
                return None

    def remove_html_tags(self, html):
        """Usa o parser já inicializado"""
        soup = BeautifulSoup(html, self.parser)
        return soup.get_text()

    def save_html(self, html, url):
        """Usa o diretório já criado"""
        nome_arquivo = url.replace("http://", "").replace("https://", "").replace("/", "_").replace(":", "_").replace(".", "_")
        caminho_html = os.path.join(self.html_dir, f"{nome_arquivo}.txt")
        with open(caminho_html, 'w', encoding='utf-8') as f:
            f.write(html)
        return caminho_html

    def store_bloqueado_notification(self, url, mensagem):
    # Envia notificação de bloqueio para o cliente via SSE
        try:
            print(f"Enviando notificação de bloqueio para o URL: {url}")
            response = requests.post("http://127.0.0.1:5000/notify_blocked", json={"url": url, "mensagem": mensagem})
            response.raise_for_status()
            print("Notificação de bloqueio enviada com sucesso.")
        except requests.RequestException as e:
            print(f"Erro ao enviar notificação de bloqueio: {e}")


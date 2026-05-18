from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urlparse
from datetime import datetime
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


_NAV_ID_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    re.IGNORECASE,
)

# Conteúdo típico de interstitial Cloudflare / anti-bot (headless costuma receber isto em vez do artigo).
_BOT_WALL_MARKERS = (
    "verify that you're not a robot",
    "you need to verify",
    "javascript is disabled",
    "enable javascript and then reload",
    "cf-browser-verification",
    "challenges.cloudflare.com",
    "just a moment",
    "checking your browser",
    "attention required",
    "ray id",
)


def _looks_like_bot_challenge_html(html):
    if not html or not isinstance(html, str):
        return False
    low = html.lower()
    if len(html) < 25000 and any(m in low for m in _BOT_WALL_MARKERS):
        return True
    return False


class TratamentoDados:
    def __init__(self, db, html_dir=None):
        self.url = None
        self.data_hora = None
        self.ip_maquina = None
        self.db = db

        # BeautifulSoup parser
        self.parser = 'html.parser'

        # Diretório de HTMLs
        self.html_dir = html_dir or os.getenv('HTML_DUMPS_DIR', '/home/mauricio/Desktop/html_dumps')
        if not os.path.exists(self.html_dir):
            os.makedirs(self.html_dir)

        # Headers padrão
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }

    # === EXTRAÇÃO DE DADOS DO LOG ===

    @staticmethod
    def extract_nav_id_from_log_line(log_line):
        """Último token UUID v4 emitido pelo proxy (navId); linhas antigas retornam None."""
        parts = log_line.strip().split()
        if len(parts) < 4:
            return None
        candidate = parts[-1]
        return candidate if _NAV_ID_RE.match(candidate) else None

    @staticmethod
    def extract_site_from_log_line(log_line):
        """Extrai a URL completa (campo 3) da linha do log."""
        parts = log_line.strip().split()
        if len(parts) >= 3:
            url = parts[3]
            if len(parts) >= 5 and _NAV_ID_RE.match(parts[-1]):
                url = " ".join(parts[3:-1]) if len(parts) > 5 else parts[3]
            return url
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
            #print("Erro ao processar a URL:", e)
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
        """Extrai o HTML da página usando Playwright (modo rápido)."""
        print(f"\n=== Iniciando extração de HTML para {url} ===")

        if not url.startswith("http://") and not url.startswith("https://"):
            # HTTPS evita redirecionamentos frágeis e páginas diferentes em HTTP.
            url = f"https://{url}"

        headed = os.getenv("PLAYWRIGHT_HEADED", "").strip().lower() in (
            "1",
            "true",
            "yes",
        )
        channel = os.getenv("PLAYWRIGHT_CHANNEL", "").strip() or None
        # Ex.: PLAYWRIGHT_CHANNEL=chrome — usa o Chrome instalado; costuma passar mais WAFs que o Chromium puro em headless.

        print("→ Iniciando Playwright...")
        launch_kwargs = {
            "headless": not headed,
            "args": ["--disable-blink-features=AutomationControlled"],
        }
        if channel:
            launch_kwargs["channel"] = channel

        with sync_playwright() as p:
            browser = p.chromium.launch(**launch_kwargs)
            context = browser.new_context(
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/131.0.0.0 Safari/537.36"
                ),
                viewport={"width": 1365, "height": 900},
                locale="en-US",
                timezone_id="America/New_York",
                extra_http_headers={
                    "Accept-Language": "en-US,en;q=0.9",
                },
            )
            context.add_init_script(
                "Object.defineProperty(navigator, 'webdriver', { get: () => undefined });"
            )
            page = context.new_page()

            try:
                print("→ Navegando para a URL...")
                page.goto(url, timeout=60000, wait_until="load")
                html = page.content()

                if _looks_like_bot_challenge_html(html):
                    print(
                        "→ HTML parece interstitial anti-bot; aguardando rede e recapturando…"
                    )
                    try:
                        page.wait_for_load_state("networkidle", timeout=20000)
                    except Exception:
                        pass
                    page.wait_for_timeout(3000)
                    html = page.content()

                print(f"✓ HTML extraído (Tamanho: {len(html)} caracteres)")
                return html
            except Exception as e:
                print(f"✗ ERRO: {str(e)} ({e.__class__.__name__})")
                return None
            finally:
                context.close()
                browser.close()

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

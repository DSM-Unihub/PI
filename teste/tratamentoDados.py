import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse
from datetime import datetime

class TratamentoDados:
    # Métodos omitidos para brevidade...
    
    def store_bloqueado_notification(self, url, palavra_chave):
        """
        Envia notificação de bloqueio para o cliente via SSE, incluindo a palavra-chave que acionou o bloqueio.
        """
        try:
            response = requests.post("http://127.0.0.1:5000/notify_blocked", json={"url": url, "motivo": palavra_chave})
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Erro ao enviar notificação de bloqueio: {e}")

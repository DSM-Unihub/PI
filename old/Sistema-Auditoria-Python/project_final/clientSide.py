import requests
from win10toast import ToastNotifier

# Inicializa o sistema de notificações para o Windows.
toaster = ToastNotifier()

def receive_sse_notification():
    # URL do servidor que envia notificações via SSE.
    url = "http://127.0.0.1:5000/stream"
    
    try:
        # Faz uma requisição GET para o servidor, mantendo a conexão aberta (stream=True) para receber eventos em tempo real.
        with requests.get(url, stream=True) as response:
            # Itera sobre as linhas da resposta (cada evento SSE enviado pelo servidor).
            for line in response.iter_lines():
                if line:
                    # Título da notificação.
                    title = "Resist"
                    # Decodifica a linha recebida (SSE formata os dados com "data: "), removendo o prefixo "data: ".
                    message = line.decode('utf-8').replace("data: ", "")
                    # Exibe a notificação com o título, mensagem e ícone por 10 segundos.
                    toaster.show_toast(title, message, icon_path="Sistema-Auditoria-Python/Notificação_SSE/resist.ico", duration=10)
    except Exception as e:
        # Captura e exibe qualquer erro que ocorrer ao tentar receber a notificação.
        print(f"Erro ao receber notificação: {e}")
    
if _name_ == "_main_":
    # Inicia a função para receber notificações SSE.
    receive_sse_notification()
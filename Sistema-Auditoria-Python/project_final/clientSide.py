import requests
from win10toast import ToastNotifier

toaster = ToastNotifier()

def receive_sse_notification():
    url = "http://127.0.0.1:5000/stream"
    try:
        with requests.get(url, stream=True) as response:
            for line in response.iter_lines():
                if line:
                    title = "Alerta de Bloqueio"
                    message = line.decode('utf-8').replace("data: ", "")
                    toaster.show_toast(title, message, duration=10)
    except Exception as e:
        print(f"Erro ao receber notificação: {e}")

if __name__ == "__main__":
    receive_sse_notification()

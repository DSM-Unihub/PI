import requests

def send_notification_to_windows(title, message):
    url = 'http://10.67.56.57:5000/notify'
    payload = {
        'title': title,
        'message': message
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            print("Notificação enviada com sucesso!")
        else:
            print("Falha ao enviar notificação:", response.text)
    except requests.RequestException as e:
        print(f"Erro ao enviar notificação: {e}")

# Exemplo de uso
send_notification_to_windows('Erro no Sistema', 'Houve um erro no sistema. Verifique o servidor para mais detalhes.')

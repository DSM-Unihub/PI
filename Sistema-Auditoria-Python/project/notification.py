import time  # Importa o módulo time, usado para pausar a execução do programa.
import threading  # Importa o módulo threading, usado para criar e gerenciar threads.
from plyer import notification  # Importa o módulo notification da biblioteca plyer, usado para enviar notificações do sistema.
import logging
# Função responsável por enviar notificações periódicas sobre o bloqueio de um site.
def sendNotification():
    # Envia uma notificação sobre o bloqueio do site.
    notification.notify(
        title="Site Bloqueado",  # Título da notificação.
        message="O Site foi Bloqueado por conter conteudo: conteudo",  # Mensagem exibida na notificação.
        timeout=10  # Tempo (em segundos) que a notificação ficará visível.
    )

# Função responsável por iniciar um thread que enviará as notificações.
def secondPlace():
    # Cria um novo thread para executar a função sendNotification.
    thread = threading.Thread(target=sendNotification)
    thread.daemon = True  # Define o thread como daemon, permitindo que ele rode em segundo plano.
    thread.start()  # Inicia a execução do thread.

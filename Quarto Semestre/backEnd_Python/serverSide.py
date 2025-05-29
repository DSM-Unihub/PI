from flask import Flask, Response, request
import os
import time
import threading

app = Flask(__name__)
notificacoes = []
bloqueados_file_path = "/root/bloqueados.txt"

def monitorar_bloqueados():
    """Monitora o arquivo bloqueados.txt e adiciona notificações para novos sites."""
    if not os.path.exists(bloqueados_file_path):
        # Cria o arquivo se ele não existir
        open(bloqueados_file_path, 'w').close()

    # Lê o arquivo inicial para capturar o estado inicial
    with open(bloqueados_file_path, 'r') as file:
        linhas_processadas = set(file.readlines())

    while True:
        with open(bloqueados_file_path, 'r') as file:
            # Lê todas as linhas do arquivo
            linhas_atuais = set(file.readlines())

        # Identifica novas linhas adicionadas
        novas_linhas = linhas_atuais - linhas_processadas

        if novas_linhas:
            for linha in novas_linhas:
                linha = linha.strip()
                if linha:  # Ignora linhas vazias
                    notificacoes.append(f"Site bloqueado: {linha}")

            # Atualiza as linhas processadas
            linhas_processadas = linhas_atuais

        # Aguarda um tempo antes de verificar novamente
        time.sleep(1)

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            if notificacoes:
                # Envia a notificação para o cliente
                yield f"data: {notificacoes.pop(0)}\n\n"
    return Response(event_stream(), content_type='text/event-stream')

if __name__ == "__main__":
    # Inicia a thread para monitorar o arquivo bloqueados.txt
    threading.Thread(target=monitorar_bloqueados, daemon=True).start()

    # Inicia o servidor Flask
    app.run(host='0.0.0.0', port=5000)

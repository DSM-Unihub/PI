from flask import Flask, Response, request
import json
import time

app = Flask(__name__)
notificacoes = []

@app.route('/notify_blocked', methods=['POST'])
def notify_blocked():
    dados = request.get_json()
    notificacoes.append(f"Site bloqueado: {dados['url']} - Motivo: {dados['motivo']}")
    return '', 204

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            if notificacoes:
                yield f"data: {notificacoes.pop(0)}\n\n"
            time.sleep(1)
    return Response(event_stream(), content_type='text/event-stream')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

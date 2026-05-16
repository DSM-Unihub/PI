from flask import Flask, Response
import time

app = Flask(__name__)

@app.route('/stream')
def stream():
    def event_stream():
        while True:
            time.sleep(5)  # Espera entre as notificações (simulação)
            yield f"data: Site bloqueado: O site contém conteúdo impróprio.\n\n"
    
    return Response(event_stream(), content_type='text/event-stream')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)

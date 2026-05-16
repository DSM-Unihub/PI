from flask import Flask, request, jsonify
from transformers import pipeline

#imports para a criptografia contratual
import hmac
import hashlib
import time
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
toxicity_classifier = None  # will initialize later

SECRET_KEY = os.getenv('API_SECRET_KEY', 'sua_chave_secreta_aqui')
MAX_TIMESTAMP_DIFF = 300  # 5 minutes

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_token = request.headers.get('X-Auth-Token')  # Mudado de 'Authorization'
        timestamp = request.headers.get('X-Timestamp')
        
        if not auth_token or not timestamp:
            return jsonify({"error": "Não autorizado"}), 401
        
        try:
            # Verifica se o timestamp está dentro do limite permitido
            timestamp_diff = abs(int(time.time()) - int(timestamp))
            if timestamp_diff > MAX_TIMESTAMP_DIFF:
                return jsonify({"error": "Token expirado"}), 401
            
            # Recria o hash para verificação
            message = f"{timestamp}:{request.get_data().decode('utf-8')}"
            expected_token = hmac.new(
                SECRET_KEY.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(auth_token, expected_token):
                return jsonify({"error": "Token inválido"}), 401
        
        except Exception as e:
            return jsonify({"error": "Erro de autenticação"}), 401
        
        return f(*args, **kwargs)
    return decorated


@app.route('/verificar', methods=['POST'])
@require_auth
def verificar():
    global toxicity_classifier
    data = request.json
    if not data or "texto" not in data:
        return jsonify({"error": "Campo 'texto' é obrigatório"}), 400

    texto = data["texto"]

    # Return all possible labels + scores
    resultados = toxicity_classifier(texto, return_all_scores=True)[0]
    return jsonify(resultados)

if __name__ == "__main__":
    # HateXplain is multi-label, works better with this config
    toxicity_classifier = pipeline(
        "text-classification",
        model="sadjava/multilingual-hate-speech-xlm-roberta"
    )
    app.run(debug=True)

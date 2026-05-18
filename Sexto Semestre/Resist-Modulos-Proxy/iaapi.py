from flask import Flask, request, jsonify
from transformers import pipeline

# imports para a criptografia contratual
import hmac
import hashlib
import time
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
toxicity_classifier = None

SECRET_KEY = os.getenv("API_SECRET_KEY", "sua_chave_secreta_aqui")
MAX_TIMESTAMP_DIFF = 300  # 5 minutes
VERIFICAR_BATCH_MAX = int(os.getenv("VERIFICAR_BATCH_MAX", "16"))


def _normalize_batch_scores(raw_out, bs: int):
    """
    Garante lista de comprimento bs: cada elemento é uma lista de {label, score}
    compatível com um único /verificar.
    """

    if raw_out is None:
        raise ValueError("pipeline retornou None")

    if bs == 0:
        return []

    if bs == 1:
        if isinstance(raw_out, list):
            if len(raw_out) == 1 and isinstance(raw_out[0], list):
                inner = raw_out[0]

                if isinstance(inner, list) and (
                    not inner or isinstance(inner[0], dict)
                ):
                    return [inner]

            if raw_out and isinstance(raw_out[0], dict):
                return [raw_out]

        if isinstance(raw_out, dict):
            return [[raw_out]]

        raise ValueError("formato inesperado (bs=1)")

    if not isinstance(raw_out, (list, tuple)):
        raise ValueError("formato batch inesperado")

    rows = []

    for i, row in enumerate(raw_out):
        if isinstance(row, list) and (
            not row or isinstance(row[0], dict)
        ):
            rows.append(row)

        elif isinstance(row, dict):
            rows.append([row])

        else:
            raise ValueError(f"elemento batch {i}: formato inválido")

    if len(rows) != bs:
        raise ValueError(
            f"pipeline retornou {len(rows)} itens para batch {bs}"
        )

    return rows


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_token = request.headers.get("X-Auth-Token")
        timestamp = request.headers.get("X-Timestamp")

        if not auth_token or not timestamp:
            return jsonify({"error": "Não autorizado"}), 401

        try:
            timestamp_diff = abs(int(time.time()) - int(timestamp))

            if timestamp_diff > MAX_TIMESTAMP_DIFF:
                return jsonify({"error": "Token expirado"}), 401

            message = f"{timestamp}:{request.get_data().decode('utf-8')}"

            expected_token = hmac.new(
                SECRET_KEY.encode(),
                message.encode(),
                hashlib.sha256,
            ).hexdigest()

            if not hmac.compare_digest(auth_token, expected_token):
                return jsonify({"error": "Token inválido"}), 401

        except Exception as e:
            print("Erro auth:", e)
            return jsonify({"error": "Erro de autenticação"}), 401

        return f(*args, **kwargs)

    return decorated


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "online"})


@app.route("/verificar", methods=["POST"])
# @require_auth
def verificar():

    global toxicity_classifier

    if toxicity_classifier is None:
        return jsonify({"error": "Modelo ainda não carregado"}), 503

    data = request.get_json(silent=True)

    if not data or "texto" not in data:
        return jsonify({"error": "Campo 'texto' é obrigatório"}), 400

    texto = str(data["texto"]).strip()

    if not texto:
        return jsonify([])

    try:
        resultados = toxicity_classifier(
            texto,
            return_all_scores=True
        )[0]

        return jsonify(resultados)

    except Exception as e:
        print("Erro /verificar:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/verificar-batch", methods=["POST"])
# @require_auth
def verificar_batch():

    global toxicity_classifier

    if toxicity_classifier is None:
        return jsonify({"error": "Modelo ainda não carregado"}), 503

    data = request.get_json(silent=True) or {}

    textos = data.get("textos")

    if textos is None:
        return jsonify({"error": "Campo 'textos' é obrigatório"}), 400

    if not isinstance(textos, list):
        return jsonify({"error": "Campo 'textos' deve ser uma lista"}), 400

    textos_limpos = []

    for item in textos:

        if not isinstance(item, str):
            item = str(item) if item is not None else ""

        textos_limpos.append(item.strip())

    if len(textos_limpos) > VERIFICAR_BATCH_MAX:
        return jsonify({
            "error": f"No máximo {VERIFICAR_BATCH_MAX} textos por requisição"
        }), 400

    if not any(textos_limpos):
        return jsonify({"resultados": []})

    bs = len(textos_limpos)

    try:

        try:
            out = toxicity_classifier(
                textos_limpos,
                return_all_scores=True,
                batch_size=bs,
            )

        except TypeError:
            out = toxicity_classifier(
                textos_limpos,
                return_all_scores=True,
            )

        resultados = _normalize_batch_scores(out, bs)

        return jsonify({"resultados": resultados})

    except Exception as e:
        print("Erro /verificar-batch:", e)
        return jsonify({"error": str(e)}), 500


def load_model():
    """
    Carrega o modelo com logs visíveis.
    """

    global toxicity_classifier

    print("\n==============================")
    print("Loading HuggingFace model...")
    print("==============================\n")

    toxicity_classifier = pipeline(
        "text-classification",
        model="sadjava/multilingual-hate-speech-xlm-roberta",
        truncation=True,
    )

    print("\n==============================")
    print("Model loaded successfully!")
    print("==============================\n")


if __name__ == "__main__":

    try:

        print("Starting application...")

        load_model()

        print("Starting Flask server...")
        print("API running at: http://127.0.0.1:5000")

        app.run(
            host="0.0.0.0",
            port=5000,
            debug=False,
            use_reloader=False,
        )

    except Exception as e:

        print("\n==============================")
        print("FATAL ERROR")
        print("==============================")
        print(e)
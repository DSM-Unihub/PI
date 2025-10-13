from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
toxicity_classifier = None  # will initialize later

@app.route('/verificar', methods=['POST'])
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

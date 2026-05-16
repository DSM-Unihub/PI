import os
import torch
from transformers import AutoModelForSequenceClassification, BertTokenizer, AutoConfig
import matplotlib.pyplot as plt

def load_model_and_tokenizer(model_path):
    """Load the model and tokenizer from the specified path."""
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"The model path '{model_path}' does not exist.")
    
    # Load the configuration
    config = AutoConfig.from_pretrained(model_path)
    
    # Load the pre-trained BERT tokenizer
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    
    # Load the model
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    
    return model, tokenizer, config

def tokenize_function(texts):
    """Tokenizes the input texts."""
    return tokenizer(texts, padding='max_length', truncation=True, max_length=128)

# Load the model and tokenizer
model_path = r"C:\Users\bruno\Desktop\Ia_teste\results_sample\checkpoint-250"  # Update with your model path
model, tokenizer, config = load_model_and_tokenizer(model_path)

print(f"Model loaded with {config.num_labels} classes.")
print(f"Class labels: {config.id2label}")

# Example usage of the tokenize_function
sample_texts = [
    "I love this product!",
    "This is the worst experience I've ever had.",
    "I think everyone should be treated equally.",
    "Hate speech should not be tolerated."
]

# Tokenize the sample texts
train_encodings = tokenize_function(sample_texts)
print(train_encodings)  # This will show the tokenized output

class Bloqueio:
    def __init__(self, arm_file_path, html_directory):
        self.arm_file_path = arm_file_path
        self.html_directory = html_directory
        self.termo = "camicado"  # Palavra-chave a ser verificada
        self.model, self.tokenizer = self.load_model()

    def load_model(self):
        """Load the offensive classification model and tokenizer."""
        model_path = r"C:\Users\bruno\Desktop\Ia_teste\results_sample\checkpoint-250"  # Path to the directory containing the model files
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"The model path '{model_path}' does not exist.")
        
        # Load the configuration
        config = AutoConfig.from_pretrained(model_path)
        
        # Load the tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        
        # Load the model
        model = AutoModelForSequenceClassification.from_pretrained(model_path)
        
        return model, tokenizer

    def classify_text(self, text):
        """Classify the given text as offensive or not."""
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
        logits = outputs.logits
        predicted_class = logits.argmax().item()
        return predicted_class

# The sentence to test
text = "Welcome to our community blog, stupid bitch :)"

# Tokenize the text
inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)

# Perform inference
with torch.no_grad():
    outputs = model(**inputs)

# Extract logits (raw output from the model)
logits = outputs.logits

# Apply sigmoid to convert logits to probabilities
probabilities = torch.sigmoid(logits).squeeze()

# Define the categories for the graph
label_mapping = {
    0: 'toxicity',
    1: 'severe_toxicity',
    2: 'obscene',
    3: 'sexual_explicit',
    4: 'identity_attack',
    5: 'insult',
    6: 'threat'
}

# Display the results in the prompt
for idx, prob in enumerate(probabilities.tolist()):
    print(f'{label_mapping[idx]}: {prob:.4f}')

# Generate the pie chart
plt.pie(probabilities, labels=label_mapping.values(), autopct='%1.2f%%', startangle=90)
plt.axis('equal')  # Ensure the pie chart is a circle
plt.title('Hate Speech Classification Probabilities')
plt.show()
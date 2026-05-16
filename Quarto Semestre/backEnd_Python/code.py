import time
import os

def tail_file(log_file_path):
    print(f"Monitorando o arquivo: {log_file_path}")
    
    try:
        with open(log_file_path, 'r', encoding='utf-8', errors='ignore') as file:
            file.seek(0, os.SEEK_END)  # Vai para o final do arquivo

            while True:
                line = file.readline()
                
                if not line:
                    time.sleep(0.3)  # Aguarda um pouco antes de tentar ler de novo
                    continue
                
                print(line.strip())  # Imprime a nova linha encontrada
    except FileNotFoundError:
        print(f"Arquivo {log_file_path} não encontrado.")
    except Exception as e:
        print(f"Erro ao ler o arquivo: {e}")

# Exemplo de uso
log_file = "/etc/squid/files/access.txt"  # Altere para o caminho do seu arquivo de log
tail_file(log_file)

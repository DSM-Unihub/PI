import subprocess
import sys
import time

def start_system():
    try:
        # Inicia o servidor
        server = subprocess.Popen([sys.executable, 'serverSide.py'])
        print("Servidor iniciado...")
        time.sleep(2)  # Aguarda o servidor iniciar
        
        # Inicia o cliente de notificações
        client = subprocess.Popen([sys.executable, 'clientSide.py'])
        print("Cliente de notificações iniciado...")
        
        # Inicia o monitor principal
        main = subprocess.Popen([sys.executable, 'main.py'])
        print("Monitor principal iniciado...")
        
        # Mantém o script rodando
        main.wait()
        
    except KeyboardInterrupt:
        print("\nEncerrando o sistema...")
        server.terminate()
        client.terminate()
        main.terminate()

if __name__ == "__main__":
    start_system() 
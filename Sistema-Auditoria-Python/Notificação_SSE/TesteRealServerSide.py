from flask import Flask, Response 
import time 
import threading
import os

app = Flask(__name__)

blocked_sites = set()
clients = {}
file_path = 'bloqueados.txt'
squid_log_path = "/var/log/squid/access.log"

def notify_clients(clientId,message):
    if clientId in clients:
        clients[clientId].put(message)


def read_blocked_sites():
    if not os.path.exists(file_path):
        return set()
    
    with open(file_path, 'r') as f:
        return set(line.strip() for line in f if line.strip())


def monitor_blocked_sites():
    global blocked_sites
    while True:
        current_sites = read_blocked_sites()
        new_sites = current_sites - blocked_sites

        for site in new_sites:
            blocked_sites.add(site)
            # Aqui você pode escolher como registrar qual cliente foi notificado.
        
        time.sleep(10)

def monitor_squid_log():
    with open(squid_log_path,"r") as f:
        f.seek(0, os.SEEK_END)
        while True:
            line = f.readline()
            if not line:
                time.sleep(1)
                continue

            parts = line.split()
            if len(parts) > 0:
                ip_address = parts[0]
                site = "exemplo.com"
                if site in blocked_sites:
                    notify_clients(ip_address, f"Site bloqueado: {site}")

@app.route("/stream")

def stream():
    def event_stream():
        queue = Queue()
        clients.append(queue)
        try:
            while True:
                message = queue.get()
                yield f"data: {message}/n/n"
        finally:
            clients.remove(queue)
    
    return Response(event_stream(), content_type="text/event-stream")

if __name__ == "__main__":
    threading.Thread(target=monitor_blocked_sites, daemon=True).start()
    app.run(host='0.0.0.0', port = 5000)
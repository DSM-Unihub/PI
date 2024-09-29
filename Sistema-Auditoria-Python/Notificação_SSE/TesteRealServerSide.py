from flask import Flask, Response 
import time 
import threading
import os

app = Flask(__name__)

bloqued_sites = set()
clients = []
file_path = 'bloqueados.txt'

def notify_clients(message):
    clients.put(message)


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
            notify_clients(f"Site Bloqueado: {site}")
        
        time.sleep(10)

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
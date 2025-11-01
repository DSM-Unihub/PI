from mitmproxy import http
import datetime

def request(flow: http.HTTPFlow) -> None:
    client_ip = flow.client_conn.peername[0] if flow.client_conn.peername else "-"
    host = flow.request.host
    port = flow.request.port
    method = flow.request.method
    content_type = flow.request.headers.get("Content-Type", "-")

    # Data/hora no formato: dd/MM/yyyy HH:mm:ss:SSS
    now = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S:%f")[:-3]

    log_line = f"{now} {client_ip} {host}:{port} {method} {content_type}\n"

    with open("/home/server/Desktop/access.txt", "a", encoding="utf-8") as f:
        f.write(log_line)
        
        # mitmdump -p 8080 -s "/home/server/Desktop/PI-main-end-pt333/Sistema-Auditoria-Python/project_final/mitmscript.py" --mode upstream:http://192.168.12.1:3128
        
        
        # mitmdump -p 8080 -s "/home/mauricio/Desktop/pi-dia-d/backup-vespera-PI/backEnd_Python/mitmscript.py" --mode upstream:http://192.168.12.1:3128 

import time
import win32serviceutil
import win32service
import win32event
import win32api
import requests
from win10toast import ToastNotifier

class AppServerSvc(win32serviceutil.ServiceFramework):
    _svc_name_ = "SSENotificationService"
    _svc_display_name_ = "SSE Notification Service"
    _svc_description_ = "Recebe Notificaçoes via SSE do servidor Linux e exibe no cliente Windows "


    def __init__(self, args):
        win32serviceutil.ServiceFramework.__init__(self, args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)
        self.toaster = ToastNotifier()
        self.is_running = True
        self.main()
        
    
    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        self.is_running = False
        win32event.SetEvent(self.hWaitStop)
        
    
    def SvcDoRun(self):
        self.main()
    
    
    def main(self):
        url = "http://127.0.0.1:5000/stream"
        while self.is_running:
            try:
                with requests.get(url, stream=True) as response:
                    for line in response.iter_lines():
                        if line:
                            # Título da notificação.
                            title = "Resist"
                            # Decodifica a linha recebida (SSE formata os dados com "data: "), removendo o prefixo "data: ".
                            message = line.decode('utf-8').replace("data: ", "")
                            # Exibe a notificação com o título, mensagem e ícone por 10 segundos.
                            toaster.show_toast(title, message, icon_path="Sistema-Auditoria-Python/Notificação_SSE/resist.ico", duration=10)
            except Exception as e:        
                print(f"Erro ao receber notificação: {e}")
            time.sleep(10)
            
            
if __name__ == "__main__":
    win32serviceutil.HandleCommandLine(AppServerSvc)
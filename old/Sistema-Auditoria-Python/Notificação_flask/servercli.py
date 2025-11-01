from flask import Flask, request
from win10toast import ToastNotifier

app = Flask(__name__)
toaster = ToastNotifier()

@app.route('/notify', methods=['POST'])
def notify():
    try:
        data = request.json
        title = data.get('title', 'Notification')
        message = data.get('message', 'You have a new notification.')
        toaster.show_toast(title, message, duration=10)
        return 'Notification sent!', 200
    except Exception as e:
        print(f"Error sending notification: {e}")
        return 'Error sending notification', 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

import { SerialPort } from "serialport";

let port;

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      if (!port || !port.isOpen) {
        port = new SerialPort({ path: "COM8", baudRate: 9600 }); // ou "/dev/ttyUSB0" no Linux
      }

      port.on("data", (data) => {
        console.log("Recebido da serial:", data.toString());
        // Aqui você pode guardar, enviar por websocket, etc.
      });

      res.status(200).json({ message: "Conectado ao Arduino com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
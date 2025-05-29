import { SerialPort } from "serialport";
import WebSocket, { WebSocketServer } from "ws";

const port = new SerialPort({ path: "COM8", baudRate: 9600 });

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws) => {
  console.log("Cliente conectado via WebSocket");

  port.on("data", (data) => {
    const msg = data.toString().trim();
    ws.send(msg);
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

console.log("WebSocket server rodando na porta 3001");
import React, { useState, useEffect, useRef } from "react";
import styles from "./box.module.css";
import { useRouter } from "next/router";

export default function ValidationBox() {
  const [inputValue, setInputValue] = useState("");
  const [portConnected, setPortConnected] = useState(false);
  const router = useRouter();
  const buttonRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.103:3001");
    let buffer = "";

    ws.onopen = () => {
      setPortConnected(true);
      console.log("WebSocket conectado");
    };

    ws.onmessage = (event) => {
      const char = event.data.trim();

      if (char === "A") {
        buttonRef.current.click();
        buffer = "";
      } else if (char === "B") {
        buffer = buffer.slice(0, -1);
        setInputValue(buffer);
      } else if (/^\d$/.test(char)) {
        buffer += char;
        setInputValue(buffer);
      }
    };

    ws.onerror = (err) => {
      console.error("Erro no WebSocket:", err);
    };

    ws.onclose = () => {
      setPortConnected(false);
      console.log("WebSocket desconectado");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSubmit = () => {
    if (inputValue === "123") {
      router.push("/");
    } else {
      alert("Senha incorreta");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <h2>Segunda Validação</h2>
        {!portConnected && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            Conecte o Arduino ao servidor
          </p>
        )}

        <input type="text" value={inputValue} placeholder="Digite um número" readOnly />

        <button
          ref={buttonRef}
          onClick={handleSubmit}
          // onClick={ router.push("/")}

          disabled={inputValue !== "123"}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
import express from "express";
import cors from "cors"; 
import "./config/db-connection.js";
import indexacaoRoutes from "./routes/indexacaoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sugestaoRoutes from "./routes/sugestaoRoutes.js";

import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors())
app.use(express.json()); // Re-enabled for JSON body parsing
app.use(express.urlencoded({ extended: true })); // Re-enabled for URL-encoded body parsing


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "public")));


app.use("/api", indexacaoRoutes, userRoutes,sugestaoRoutes);

app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno no servidor" })
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});


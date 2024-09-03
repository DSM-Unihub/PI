import funcionarioService from "../services/funcionarioService.js";

import { ObjectId } from "mongodb";

const getAllFuncionarios = async (req, res) => {
  try {
    const funcionarios = await funcionarioService.getAll();
    res.status(200).json({ funcionarios: funcionarios });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor!" });
  }
};

const createFuncionario = async (req, res) => {
  try {
    const { nome, emails, senha, telefones, foto } = req.body;
    await funcionarioService.Create(nome, emails, senha, telefones, foto);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor!" });
  }
};

export default { getAllFuncionarios, createFuncionario};

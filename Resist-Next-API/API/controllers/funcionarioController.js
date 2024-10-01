import funcionarioService from "../services/funcionarioService.js";

import { ObjectId } from "mongodb";

const getAllFuncionarios = async (req, res) => {
  try {
    const funcionarios = await funcionarioService.getAll();
    const funcionariosSemSenha = funcionarios.map(
      ({ senha, ...resto }) => resto
    );
    res.status(200).json({ funcionarios: funcionariosSemSenha });
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

const updateFuncionario = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;

      const { nome, emails, senha, telefones, foto } = req.body;
      await funcionarioService.Update(nome, emails, senha, telefones, foto);
      res.sendStatus(200).json("Dados do Usuario alterado");
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.status.json({ error: "Erro interno no servidor!" });
  }
};

const deleteFuncionario = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      funcionarioService.Delete(id);
      res.sendStatus(204).json("Usuario Deletado!");
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

const getOneFuncionario = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const id = req.params.id;
      const funcionario = await funcionarioService.getById(id);
      const funcionarioSemSenha = {
       ...funcionario,
        senha: null,
      };
      res.status(200).json({ funcionario: funcionarioSemSenha });
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor!" });
  }
}

export default {
  getAllFuncionarios,
  updateFuncionario,
  createFuncionario,
  deleteFuncionario,
  getOneFuncionario,
};

import funcionarioService from "../services/funcionarioService.js";
import { ObjectId } from "mongodb";

class FuncionarioController {
  // Busca todos os funcionários
  async getAllFuncionarios(req, res) {
    try {
      const funcionarios = await funcionarioService.getAll();
      // Remove o campo 'senha' de cada funcionário
      const funcionariosSemSenha = funcionarios.map(({ senha, ...resto }) => resto);
      res.status(200).json({ funcionarios: funcionariosSemSenha });
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      res.status(500).json({ error: "Erro interno no servidor!" });
    }
  }

  // Cria um novo funcionário
  async createFuncionario(req, res) {
    try {
      const funcionarioCriado = await funcionarioService.create(req.body);
      res.status(201).json({ message: "Funcionário criado com sucesso!", funcionario: funcionarioCriado });
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      res.status(500).json({ error: "Erro ao criar funcionário!" });
    }
  }

  // Atualiza um funcionário existente
  async updateFuncionario(req, res) {
    try {
      const { id } = req.params;
      // Valida o ID
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido!" });
      }
      const funcionarioAtualizado = await funcionarioService.update(id, req.body);
      if (funcionarioAtualizado) {
        res.status(200).json({ message: "Funcionário atualizado com sucesso!", funcionario: funcionarioAtualizado });
      } else {
        res.status(404).json({ error: "Funcionário não encontrado!" });
      }
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      res.status(500).json({ error: "Erro ao atualizar funcionário!" });
    }
  }

  // Deleta um funcionário
  async deleteFuncionario(req, res) {
    try {
      const { id } = req.params;
      // Valida o ID
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido!" });
      }
      const funcionarioDeletado = await funcionarioService.delete(id);
      if (funcionarioDeletado) {
        res.status(200).json({ message: "Funcionário deletado com sucesso!" });
      } else {
        res.status(404).json({ error: "Funcionário não encontrado!" });
      }
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error);
      res.status(500).json({ error: "Erro ao deletar funcionário!" });
    }
  }

  // Busca um funcionário por ID
  async getOneFuncionario(req, res) {
    try {
      const { id } = req.params;
      // Valida o ID
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido!" });
      }
      const funcionario = await funcionarioService.getOne(id);
      if (funcionario) {
        const { senha, ...funcionarioSemSenha } = funcionario.toObject();
        res.status(200).json({ funcionario: funcionarioSemSenha });
      } else {
        res.status(404).json({ error: "Funcionário não encontrado!" });
      }
    } catch (error) {
      console.error("Erro ao buscar funcionário:", error);
      res.status(500).json({ error: "Erro ao buscar funcionário!" });
    }
  }
}

// Exporta uma instância única do FuncionarioController
export default new FuncionarioController();

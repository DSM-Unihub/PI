import Funcionario from "../models/Funcionario.js"; // Importa o modelo Funcionario

class FuncionarioService {
  // Busca um único funcionário pelo ID
  async getOne(id) {
    try {
      const funcionario = await Funcionario.findById(id);
      if (!funcionario) {
        throw new Error(`Funcionário com ID ${id} não encontrado`); // Lança um erro se o funcionário não for encontrado
      }
      return funcionario; // Retorna o funcionário encontrado
    } catch (error) {
      console.error("Erro ao buscar funcionário:", error); // Loga o erro no console
      throw error; // Relança o erro para tratamento posterior
    }
  }

  // Busca todos os funcionários
  async getAll() {
    try {
      return await Funcionario.find(); // Retorna todos os funcionários
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error); // Loga o erro no console
      throw error; // Relança o erro para tratamento posterior
    }
  }

  // Cria um novo funcionário
  async create(dadosFuncionario) {
    try {
      const novoFuncionario = new Funcionario(dadosFuncionario); // Cria uma nova instância do funcionário
      return await novoFuncionario.save(); // Salva e retorna o novo funcionário
    } catch (error) {
      console.error("Erro ao criar funcionário:", error); // Loga o erro no console
      throw error; // Relança o erro para tratamento posterior
    }
  }

  // Deleta funcionário pelo ID
  async delete(id) {
    try {
      const funcionarioDeletado = await Funcionario.findByIdAndDelete(id); // Tenta deletar o funcionário
      if (!funcionarioDeletado) {
        throw new Error(`Funcionário com ID ${id} não encontrado para exclusão`); // Lança um erro se o funcionário não for encontrado
      }
      console.log(`Funcionário com ID ${id} foi deletado`); // Loga a exclusão
      return funcionarioDeletado; // Retorna o funcionário deletado
    } catch (error) {
      console.error("Erro ao deletar funcionário:", error); // Loga o erro no console
      throw error; // Relança o erro para tratamento posterior
    }
  }

  // Atualiza um funcionário pelo ID
  async update(id, dadosAtualizados) {
    try {
      const funcionarioAtualizado = await Funcionario.findByIdAndUpdate(
        id,
        dadosAtualizados,
        { new: true } // Retorna o documento atualizado
      );

      if (!funcionarioAtualizado) {
        throw new Error(`Funcionário com ID ${id} não encontrado para atualização`); // Lança um erro se o funcionário não for encontrado
      }

      console.log(`Dados do funcionário com ID ${id} foram atualizados com sucesso!`); // Loga a atualização
      return funcionarioAtualizado; // Retorna o funcionário atualizado
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error); // Loga o erro no console
      throw error; // Relança o erro para tratamento posterior
    }
  }
}

// Exporta uma instância única do FuncionarioService
export default new FuncionarioService();

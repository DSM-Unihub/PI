import Instituicoes from "../models/Instituicoes.js";

class InstituicaoService {
  // Obtém todas as instituições
  async getAll() {
    try {
      return await Instituicoes.find();
    } catch (error) {
      console.error("Erro ao buscar instituições:", error);
      throw new Error("Erro ao buscar instituições");
    }
  }

  // Obtém uma instituição por ID
  async getOne(id) {
    try {
      const instituicao = await Instituicoes.findById(id);
      if (!instituicao) {
        throw new Error(`Instituição com ID ${id} não encontrada`);
      }
      return instituicao;
    } catch (error) {
      console.error("Erro ao buscar instituição:", error);
      throw error;
    }
  }

  // Cria uma nova instituição
  async create(dadosInstituicao) {
    try {
      const novaInstituicao = new Instituicoes(dadosInstituicao);
      return await novaInstituicao.save();
    } catch (error) {
      console.error("Erro ao criar instituição:", error);
      throw error;
    }
  }

  // Atualiza uma instituição pelo ID
  async update(id, dadosAtualizados) {
    try {
      const instituicaoAtualizada = await Instituicoes.findByIdAndUpdate(
        id,
        dadosAtualizados,
        { new: true }
      );

      if (!instituicaoAtualizada) {
        throw new Error(`Instituição com ID ${id} não encontrada para atualização`);
      }
      return instituicaoAtualizada;
    } catch (error) {
      console.error("Erro ao atualizar instituição:", error);
      throw error;
    }
  }

  // Deleta uma instituição pelo ID
  async delete(id) {
    try {
      const instituicaoDeletada = await Instituicoes.findByIdAndDelete(id);
      if (!instituicaoDeletada) {
        throw new Error(`Instituição com ID ${id} não encontrada para exclusão`);
      }
      return instituicaoDeletada;
    } catch (error) {
      console.error("Erro ao deletar instituição:", error);
      throw error;
    }
  }
}

export default new InstituicaoService();

import instituicaoService from "../services/instituicaoService.js";

class InstituicaoController {
  // Obtém todas as instituições
  async getAllInstituicoes(req, res) {
    try {
      const instituicoes = await instituicaoService.getAll();
      res.status(200).json({ instituicoes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar instituições!" });
    }
  }

  // Obtém uma instituição por ID
  async getOneInstituicao(req, res) {
    try {
      const { id } = req.params;
      const instituicao = await instituicaoService.getOne(id);
      res.status(200).json({ instituicao });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: error.message });
    }
  }

  // Cria uma nova instituição
  async createInstituicao(req, res) {
    try {
      const instituicaoCriada = await instituicaoService.create(req.body);
      res.status(201).json({ message: "Instituição criada com sucesso!", instituicao: instituicaoCriada });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar instituição!" });
    }
  }

  // Atualiza uma instituição
  async updateInstituicao(req, res) {
    try {
      const { id } = req.params;
      const instituicaoAtualizada = await instituicaoService.update(id, req.body);
      res.status(200).json({ message: "Instituição atualizada com sucesso!", instituicao: instituicaoAtualizada });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: error.message });
    }
  }

  // Deleta uma instituição
  async deleteInstituicao(req, res) {
    try {
      const { id } = req.params;
      await instituicaoService.delete(id);
      res.status(200).json({ message: "Instituição deletada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: error.message });
    }
  }
}

export default new InstituicaoController();

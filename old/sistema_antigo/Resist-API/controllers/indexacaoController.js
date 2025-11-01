import indexacaoService from "../services/indexacaoService.js";

// Controlador para obter estatísticas de bloqueios
const getEstatisticasLabs = async (req, res) => {
  try {
    const estatisticas = await indexacaoService.getEstatisticasLabs();
    res.status(200).json(estatisticas);
  } catch (error) {
    console.error("Erro ao obter estatísticas de bloqueios:", error);
    res.status(500).json({ error: "Erro ao obter estatísticas de bloqueios" });
  }
};

const getUltimasAtividades = async (req, res) => {
  try {
    const atividades = await indexacaoService.getUltimasAtividades();
    res.status(200).json(atividades);
  } catch (error) {
    console.error("Erro ao obter estatísticas de bloqueios:", error);
    res.status(500).json({ error: "Erro ao obter estatísticas de atividades" });
  }
};

const getEstatisticasBloqueios = async (req, res) => {
  try {
    const bloqueios = await indexacaoService.getEstatisticasMensais();
    res.status(200).json(bloqueios);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de bloqueios:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas de bloqueios" });
  }
};

const getAllBlocks = async (req, res) => {
  try {
    const blocks = await indexacaoService.getAllBlocks();
    res.status(200).json(blocks);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de bloqueios:", error);
    res.status(500).json({ error: "Erro ao buscar bloqueios" });
  }
};

const getBloqueiosPorMes = async (req, res) => {
  try {
    const bloqueiosMes = await indexacaoService.getBloqueiosPorMesesAno();
    res.status(200).json(bloqueiosMes);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de bloqueios por mês:", error);
    res.status(500).json({ error: "Erro ao buscar bloqueios por mês" });
  }
};

// Controlador para criar um bloqueio
const createBlock = async (req, res) => {
  try {
    const { url, motivo, periodo, tipoInsercao, ipMaquina, urlWeb } = req.body;

    // Validação básica
    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória." });
    }

    const dadosBloqueio = {
      url,
      motivo: motivo || "Bloqueio Manual",
      periodo: periodo || "Indefinido",
      tipoInsercao: tipoInsercao || "Manual",
      ipMaquina: ipMaquina || "192.168.1.1",
      urlWeb: urlWeb || url,
      dataHora: new Date(),
      flag: true
    };

    const bloqueioCriado = await indexacaoService.createBlock(dadosBloqueio);
    
    res.status(201).json({
      success: true,
      data: bloqueioCriado
    });
  } catch (error) {
    console.error("Erro ao criar bloqueio:", error);
    res.status(500).json({ 
      success: false,
      error: error.message || "Erro ao criar bloqueio" 
    });
  }
};

// Controlador para atualizar um bloqueio
const updateBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { flag, url, motivo, periodo } = req.body;

    // Validação do ID
    if (!id) {
      return res.status(400).json({ error: "ID do bloqueio é obrigatório." });
    }

    // Prepara os dados para atualização
    const dadosAtualizados = {};
    if (flag !== undefined) dadosAtualizados.flag = flag;
    if (url) dadosAtualizados.url = url;
    if (motivo) dadosAtualizados.motivo = motivo;
    if (periodo) dadosAtualizados.periodo = periodo;

    const bloqueioAtualizado = await indexacaoService.updateBlock(id, dadosAtualizados);

    res.status(200).json({
      success: true,
      data: bloqueioAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar bloqueio:", error);
    res.status(500).json({ error: "Erro ao atualizar bloqueio" });
  }
};

// Controlador para remover um bloqueio
 const deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;

    // Validação do ID
    if (!id) {
      return res.status(400).json({ error: "ID do bloqueio é obrigatório." });
    }

    await indexacaoService.deleteBlock(id);

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover bloqueio:", error);
    res.status(500).json({ error: "Erro ao remover bloqueio" });
  }
};

export default {
  getEstatisticasLabs,
  getEstatisticasBloqueios,
  getUltimasAtividades,
  getBloqueiosPorMes,
  getAllBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
};

import indexacaoService from "../services/indexacaoService.js";

// Controlador para obter estatísticas de bloqueios
const getEstatisticasBloqueios = async (req, res) => {
  try {
    const estatisticas = await indexacaoService.getEstatisticasBloqueios();
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
    res.status(500).json({ error: "Erro ao obter estatísticas de bloqueios" });
  }
};

export default{
  getEstatisticasBloqueios,
  getUltimasAtividades
}

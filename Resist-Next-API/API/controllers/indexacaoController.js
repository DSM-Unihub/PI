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
    res.status(500).json({ error: "Erro ao obter estatísticas de bloqueios" });
  }
};

const getEstatisticasBloqueios = async (req, res) => {
  try{
    const bloqueios =  await indexacaoService.getEstatisticasMensais()
    res.status(200).json(bloqueios)
  }catch (error) {
    console.error("Erro ao buscar estatísticas de bloqueios:", error)
    res.status(500).json({error: "Erro ao buscar estatísticas de bloqueios"})
  }
}

const getBloqueiosPorMes = async (req, res) => {
  try {
    const bloqueiosMes = await indexacaoService.getBloqueiosPorMesesAno();
    res.status(200).json(bloqueiosMes);
  } catch (error) {
    console.error("Erro ao buscar estatísticas de bloqueios:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas de bloqueios" });
  }
}

export default{
  getEstatisticasLabs,
  getEstatisticasBloqueios,
  getUltimasAtividades,
  getBloqueiosPorMes
}

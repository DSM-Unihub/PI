import { EstatisticasBloqueios } from "../services/indexacaoService.js";

// Controlador para obter estatísticas de bloqueios
export const getEstatisticasBloqueios = async (req, res) => {
  try {
    const estatisticas = await EstatisticasBloqueios();
    res.status(200).json(estatisticas);
  } catch (error) {
    console.error("Erro ao obter estatísticas de bloqueios:", error);
    res.status(500).json({ error: "Erro ao obter estatísticas de bloqueios" });
  }
};

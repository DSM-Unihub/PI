import logService from "../services/logService.js";

const getAllLogs = async (req, res) => {
  try {
    const logs = await logService.getAllLogs();
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar logs" });
  }
};

const getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: "ID do log é obrigatório." });
    }
    const log = await logService.getLogById(id);
    if (!log) {
      return res.status(404).json({ success: false, error: "Log não encontrado." });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    console.error("Erro ao buscar log por ID:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar log por ID" });
  }
};

export default {
  getAllLogs,
  getLogById,
};

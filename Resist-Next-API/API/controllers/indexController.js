import indexServices from "../services/indexServices.js";

// Controlador para gerenciar indexações
const getAllIndex = async (req, res) => {
  try {
    const indexacoes = await indexServices.getAll();
    res.status(200).json({ indexacoes });
  } catch (error) {
    console.error("Erro ao buscar indexações:", error);
    res.status(500).json({ message: "Erro ao buscar indexações" });
  }
};

// Controlador para obter acessos por mês
const getAcessosPorMes = async (req, res) => {
  try {
    const acessosPorMes = await indexServices.getAcessosPorMes();
    res.status(200).json({ acessosPorMes });
  } catch (error) {
    console.error("Erro ao buscar acessos por mês:", error);
    res.status(500).json({ message: "Erro ao buscar acessos por mês" });
  }
};

// Controlador para obter acessos por laboratório
const getAcessosPorLaboratorio = async (req, res) => {
  try {
    const laboratorio = req.params.laboratorio;
    const acessosPorLaboratorio = await indexServices.getAcessosPorLaboratorio(laboratorio);
    res.status(200).json({ acessosPorLaboratorio });
  } catch (error) {
    console.error("Erro ao buscar acessos por laboratório:", error);
    res.status(500).json({ message: "Erro ao buscar acessos por laboratório" });
  }
};

// Controlador para obter acessos por data
const getAcessosPorData = async (req, res) => {
  try {
    const dataInicial = new Date(req.params.dataInicial);
    const dataFinal = new Date(req.params.dataFinal);
    
    // Valida as entradas de data
    if (isNaN(dataInicial.getTime()) || isNaN(dataFinal.getTime())) {
      return res.status(400).json({ message: "Data inválida" });
    }

    const acessosPorData = await indexServices.getAcessosPorData(dataInicial, dataFinal);
    res.status(200).json({ acessosPorData });
  } catch (error) {
    console.error("Erro ao buscar acessos por data:", error);
    res.status(500).json({ message: "Erro ao buscar acessos por data" });
  }
};

// Exporta os controladores como um objeto
export default { 
  getAllIndex, 
  getAcessosPorMes, 
  getAcessosPorLaboratorio, 
  getAcessosPorData 
};

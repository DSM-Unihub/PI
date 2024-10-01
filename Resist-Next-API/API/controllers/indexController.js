import indexServices from "../services/indexServices.js";

const getAllIndex = async (req, res) => {
    try {
      const indexacoes = await indexServices.getAll();
      res.status(200).json({ indexacoes });
    } catch (error) {
      console.log(error);
    }
  
}

const getAcessosPorMes = async (req, res) => {
    try {
      const acessosPorMes = await indexServices.getAcessosPorMes();
      res.status(200).json({ acessosPorMes });
    } catch (error) {
      console.log(error);
    }
}

const getAcessosPorLaboratorio = async (req, res) => {
    try {
      const laboratorio = req.params.laboratorio;
      const acessosPorLaboratorio = await indexServices.getAcessosPorLaboratorio(laboratorio);
      res.status(200).json({ acessosPorLaboratorio });
    } catch (error) {
      console.log(error);
    }
}

const getAcessosPorData = async (req, res) => {
    try {
      const dataInicial = new Date(req.params.dataInicial);
      const dataFinal = new Date(req.params.dataFinal);
      const acessosPorData = await indexServices.getAcessosPorData(dataInicial, dataFinal);
      res.status(200).json({ acessosPorData });
    } catch (error) {
      console.log(error);
    }
}

export default { getAllIndex, getAcessosPorMes, getAcessosPorLaboratorio, getAcessosPorData };
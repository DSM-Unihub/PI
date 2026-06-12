import redeService from "../services/redeService.js";

const createRede = async (req, res) => {
  try {
    const rede = await redeService.create(req.body);

    return res.status(201).json({
      success: true,
      data: rede,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllRede = async (req, res) => {
  try {
    const filtros = {
      nome: req.query.nome,
      ipStart: req.query.ipStart,
      ipEnd: req.query.ipEnd,
      dia: req.query.dia,
      mes: req.query.mes,
      ano: req.query.ano,
    };

    const rede = await redeService.getAll(filtros);

    return res.status(200).json({
      success: true,
      data: rede,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteRede = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await redeService.deleteById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Registro nao encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registro deletado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getIncidenciaRede = async (req, res) => {
  try {
    const filtros = {
      dia: req.query.dia,
      mes: req.query.mes,
      ano: req.query.ano,
    };

    const resultado =
      await redeService.getIncidenciaPorRede(filtros);

    return res.status(200).json({
      success: true,
      data: resultado,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getEstatisticasBloqueios =async (req, res) => {
    try {
      const ano =
        req.query.ano ||
        new Date().getFullYear();

      const dados =
        await redeService.getEstatisticasBloqueios(
          ano
        );

      return res.status(200).json({
        success: true,
        data: dados,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
  const getUltimosBloqueios =
  async (req, res) => {
    try {
      const limite =
        req.query.limite || 8;

      const dados =
        await redeService.getUltimosBloqueios(
          limite
        );

      return res.status(200).json({
        success: true,
        data: dados,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };
export default {
  createRede,
  getAllRede,
  deleteRede,
  getIncidenciaRede,
  getEstatisticasBloqueios,
  getUltimosBloqueios
};

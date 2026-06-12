import listaBloqueadosService from "../services/listaBloqueadosService.js";

const pickUrl = (req) => req.body?.url ?? req.query?.url;

const handleList = (tipo) => async (req, res) => {
  try {
    const urls = await listaBloqueadosService.listar(tipo);
    res.status(200).json({ success: true, data: urls, count: urls.length });
  } catch (error) {
    console.error(`Erro ao listar ${tipo}:`, error);
    res.status(500).json({ success: false, error: "Erro ao listar URLs bloqueadas" });
  }
};

const handleGetOne = (tipo) => async (req, res) => {
  try {
    const url = pickUrl(req);
    if (!url) {
      return res.status(400).json({ success: false, error: "URL é obrigatória." });
    }
    const entrada = await listaBloqueadosService.buscar(tipo, url);
    if (!entrada) {
      return res.status(404).json({ success: false, error: "URL não encontrada na lista." });
    }
    res.status(200).json({ success: true, data: entrada });
  } catch (error) {
    console.error(`Erro ao buscar URL em ${tipo}:`, error);
    res.status(500).json({ success: false, error: error.message || "Erro ao buscar URL" });
  }
};

const handleAdd = (tipo) => async (req, res) => {
  try {
    const url = pickUrl(req);
    if (!url) {
      return res.status(400).json({ success: false, error: "URL é obrigatória." });
    }
    const resultado = await listaBloqueadosService.adicionar(tipo, url);
    const status = resultado.created ? 201 : 200;
    res.status(status).json({ success: true, data: resultado });
  } catch (error) {
    console.error(`Erro ao adicionar URL em ${tipo}:`, error);
    res.status(500).json({ success: false, error: error.message || "Erro ao adicionar URL" });
  }
};

const handleRemove = (tipo) => async (req, res) => {
  try {
    const url = pickUrl(req);
    if (!url) {
      return res.status(400).json({ success: false, error: "URL é obrigatória." });
    }
    const resultado = await listaBloqueadosService.remover(tipo, url);
    if (!resultado.removed) {
      return res.status(404).json({ success: false, error: "URL não encontrada na lista." });
    }
    res.status(200).json({ success: true, data: resultado });
  } catch (error) {
    console.error(`Erro ao remover URL de ${tipo}:`, error);
    res.status(500).json({ success: false, error: error.message || "Erro ao remover URL" });
  }
};

export default {
  listBloqueados: handleList("bloqueados"),
  getBloqueado: handleGetOne("bloqueados"),
  addBloqueado: handleAdd("bloqueados"),
  removeBloqueado: handleRemove("bloqueados"),

  listBloqueadosTotal: handleList("total"),
  getBloqueadoTotal: handleGetOne("total"),
  addBloqueadoTotal: handleAdd("total"),
  removeBloqueadoTotal: handleRemove("total"),
};

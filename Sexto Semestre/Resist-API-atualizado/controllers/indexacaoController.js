import indexacaoService from "../services/indexacaoService.js";

const parseBoolField = (body, field) => {
  if (!body || body[field] === undefined || body[field] === null) {
    return false;
  }
  const v = body[field];
  if (typeof v === "boolean") return v;
  const s = String(v).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
};

/** Persistido no MongoDB; omitido no body → false (bloqueio automático do proxy). */
const parseBloqueioTotal = (body) => parseBoolField(body, "bloqueioTotal");

/** When true on POST/PUT/DELETE `/bloqueios`, sync `bloqueados_total.txt` (same as `/bloqueios/total`). */
const isBloqueioTotalMitm = (body) => {
  if (parseBloqueioTotal(body)) return true;
  return parseBoolField(body, "bloqueioTotalMitm");
};

const normalizeFrasesPayload = (frases) => {
  if (!Array.isArray(frases)) return [];
  return frases
    .map((item) => {
      if (typeof item === "string") {
        const texto = item.trim();
        return texto ? { texto, ofensiva: true } : null;
      }
      if (item && typeof item === "object") {
        const texto = String(item.texto || "").trim();
        if (!texto) return null;
        const categoriaRaw = item.categoria || item.motivo || item.label || item.class;
        const categoria = categoriaRaw ? String(categoriaRaw).trim() : null;
        return {
          texto,
          ofensiva: item.ofensiva !== undefined ? Boolean(item.ofensiva) : true,
          categoria: categoria || null,
        };
      }
      return null;
    })
    .filter(Boolean);
};

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

const createManualTotalBlock = async (req, res) => {
  try {
    const { url, motivo, frases, periodo, tipoInsercao, ipMaquina, urlWeb, flag } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória." });
    }

    const dadosBloqueio = {
      url,
      motivo: motivo || "Bloqueio manual (total / mitm)",
      frases: normalizeFrasesPayload(frases),
      periodo: periodo || "Indefinido",
      tipoInsercao: tipoInsercao || "Manual",
      ipMaquina: ipMaquina || "192.168.1.1",
      urlWeb: urlWeb || url,
      dataHora: new Date(),
      flag: flag !== undefined ? String(flag).toLowerCase() === "true" : true,
      bloqueioTotal: true,
    };

    const bloqueioCriado = await indexacaoService.createManualTotalBlock(
      dadosBloqueio,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: bloqueioCriado,
    });
  } catch (error) {
    console.error("Erro ao criar bloqueio total (manual):", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro ao criar bloqueio total",
    });
  }
};

const updateManualTotalBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { flag, url, motivo, frases, periodo } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do bloqueio é obrigatório." });
    }

    const dadosAtualizados = {};
    if (flag !== undefined) dadosAtualizados.flag = flag;
    if (url) dadosAtualizados.url = url;
    if (motivo) dadosAtualizados.motivo = motivo;
    if (frases !== undefined) dadosAtualizados.frases = normalizeFrasesPayload(frases);
    if (periodo) dadosAtualizados.periodo = periodo;
    dadosAtualizados.bloqueioTotal = true;

    const atualizado = await indexacaoService.updateManualTotalBlock(
      id,
      dadosAtualizados,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: atualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar bloqueio total:", error);
    res.status(500).json({ error: "Erro ao atualizar bloqueio total" });
  }
};

const deleteManualTotalBlock = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do bloqueio é obrigatório." });
    }

    await indexacaoService.deleteManualTotalBlock(id, req.user.id);

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover bloqueio total:", error);
    res.status(500).json({ error: "Erro ao remover bloqueio total" });
  }
};

// Controlador para criar um bloqueio
const createBlock = async (req, res) => {
  try {
    const { url, motivo, frases, periodo, tipoInsercao, ipMaquina, urlWeb, flag } = req.body;
    const syncMitmTotal = isBloqueioTotalMitm(req.body);

    // Validação básica
    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória." });
    }

    const dadosBloqueio = {
      url,
      motivo: motivo || "Bloqueio Manual",
      frases: normalizeFrasesPayload(frases),
      periodo: periodo || "Indefinido",
      tipoInsercao: tipoInsercao || "Manual",
      ipMaquina: ipMaquina || "192.168.1.1",
      urlWeb: urlWeb || url,
      dataHora: new Date(),
      flag: flag !== undefined ? (String(flag).toLowerCase() === 'true') : true,
      bloqueioTotal: parseBloqueioTotal(req.body),
    };
    const bloqueioCriado = syncMitmTotal
      ? await indexacaoService.createManualTotalBlock(dadosBloqueio, req.user.id)
      : await indexacaoService.createBlock(dadosBloqueio, req.user.id);
    
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
    const { flag, url, motivo, frases, periodo } = req.body;
    const syncMitmTotal = isBloqueioTotalMitm(req.body);

    // Validação do ID
    if (!id) {
      return res.status(400).json({ error: "ID do bloqueio é obrigatório." });
    }

    // Prepara os dados para atualização
    const dadosAtualizados = {};
    if (flag !== undefined) dadosAtualizados.flag = flag;
    if (url) dadosAtualizados.url = url;
    if (motivo) dadosAtualizados.motivo = motivo;
    if (frases !== undefined) dadosAtualizados.frases = normalizeFrasesPayload(frases);
    if (periodo) dadosAtualizados.periodo = periodo;
    if (req.body.bloqueioTotal !== undefined && req.body.bloqueioTotal !== null) {
      dadosAtualizados.bloqueioTotal = parseBloqueioTotal(req.body);
    } else if (syncMitmTotal) {
      dadosAtualizados.bloqueioTotal = true;
    }

    const bloqueioAtualizado = syncMitmTotal
      ? await indexacaoService.updateManualTotalBlock(id, dadosAtualizados, req.user.id)
      : await indexacaoService.updateBlock(id, dadosAtualizados, req.user.id);

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
    const syncMitmTotal = isBloqueioTotalMitm(req.body || {});

    // Validação do ID
    if (!id) {
      return res.status(400).json({ error: "ID do bloqueio é obrigatório." });
    }

    if (syncMitmTotal) {
      await indexacaoService.deleteManualTotalBlock(id, req.user.id);
    } else {
      await indexacaoService.deleteBlock(id, req.user.id);
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover bloqueio:", error);
    res.status(500).json({ error: "Erro ao remover bloqueio" });
  }
};

const getIndexacaoByUrl = async (req, res) => {
  try {
    const { url } = req.params;

    // Validação da URL
    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória." });
    }

    const indexacao = await indexacaoService.getIndexacaoByUrl(url);
    
    res.status(200).json({
      success: true,
      data: indexacao
    });
  } catch (error) {
    console.error("Erro ao buscar indexação por URL:", error);
    res.status(error.message.includes("não encontrada") ? 404 : 500)
      .json({ 
        success: false,
        error: error.message || "Erro ao buscar indexação por URL" 
      });
  }
};

const lookupIndexacaoByUrl = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "URL é obrigatória." });
    }

    const indexacao = await indexacaoService.lookupIndexacao(url);

    res.status(200).json({
      success: true,
      data: indexacao,
    });
  } catch (error) {
    console.error("Erro no lookup de indexação por URL:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Erro no lookup de indexação por URL",
    });
  }
};
// const getIndexacoesByUser = async (req, res)=>{
//     try{
//       const {user} = req.params;
    

//     if (!user){
//       return res.status(400).json({error: "Usuário é obrigatório"})
//     }
  
//     const indexacoes = await indexacaoService.getIndexacoesByUser(user);

//     res.status(200).json({
//       success: true,
//       data: indexacoes
//     });
//   } catch (error){
//     console.error("Erro ao buscar indexacao por usuario:", user);
//     res.status(error.message.includes("Não encontrada") ? 404 : 500)
//     .json({
//       success: false,
//       error: error.message || "Erro ao buscar indexação por usuário"
//     })
//   }
// };

export default {
  getEstatisticasLabs,
  getEstatisticasBloqueios,
  getUltimasAtividades,
  getBloqueiosPorMes,
  getAllBlocks,
  createManualTotalBlock,
  updateManualTotalBlock,
  deleteManualTotalBlock,
  createBlock,
  updateBlock,
  deleteBlock,
  getIndexacaoByUrl,
  lookupIndexacaoByUrl,
  // getIndexacoesByUser,
};

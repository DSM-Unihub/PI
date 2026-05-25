import Log from '../models/Log.js';
import User from '../models/user.js';

class LogService {
  /**
   * createLog(autorId, alvoId, acao, justificativa = null, autorNome = null, alvoNome = null)
   * - autorId/alvoId: optional objectId string (keeps relation)
   * - autorNome/alvoNome: optional denormalized display name
   * If a name is missing and id is provided, we try to fetch the name from the users collection.
   */
  async createLog(autorId, alvo, acao, justificativa = null, autorNome = null,) {
    try {
      if (!acao) {
        console.error('Log Service Error: acao is required to create a log.');
        return;
      }

      // resolve author name if missing
      if (!autorNome && autorId && autorId !== 'sistema') {
        try {
          const u = await User.findById(autorId).select('nome').lean();
          autorNome = u?.nome ?? null;
        } catch (e) {
          console.warn('LogService: failed to resolve autorNome for', autorId, e);
        }
      }

     

      const logDoc = {
        autorId: autorId ?? null,
        autorNome: autorNome ?? (autorId === 'sistema' ? 'sistema' : null),
        alvo: alvo ?? null,
        acao,
        justificativa: justificativa ?? null,
        dataHora: new Date(),
      };

      await Log.create(logDoc);
    } catch (error) {
      console.error('Erro ao criar log no histórico: ', error);
    }
  }

  async getAllLogs(filtros = {}) {
    try {
      const query = {};

      if (filtros.acao) {
        const mapaAcoes = {
          Bloqueio: [
            "criacao_bloqueio",
            "Criacao_bloqueio_URL",
            "update_bloqueio_bloqueado",
            "Aprovacao_bloqueio_URL",
          ],
          Desbloqueio: [
            "update_bloqueio_desbloqueado",
            "Criacao_desbloqueio_URL",
            "Aprovacao_desbloqueio_URL",
            "remocao_bloqueio",
            "DELETAR_BLOQUEIO",
          ],
          "Aceite Sugestao": ["aceite_sugestao", "Aprovacao_bloqueio_URL", "Aprovacao_desbloqueio_URL"],
          "Aceite Sugestão": ["aceite_sugestao", "Aprovacao_bloqueio_URL", "Aprovacao_desbloqueio_URL"],
          "Recusa Sugestao": ["recusa_sugestao", "Recusa_bloqueio_URL", "Recusa_desbloqueio_URL"],
          "Recusa Sugestão": ["recusa_sugestao", "Recusa_bloqueio_URL", "Recusa_desbloqueio_URL"],
        };

        query.acao = {
          $in: mapaAcoes[filtros.acao] || [filtros.acao],
        };
      }

      if (filtros.justificativa) {
        if (filtros.justificativa === "Log gerado pelo Sistema") {
          query.$or = [
            { justificativa: null },
            { justificativa: "" },
            { justificativa: { $exists: false } },
          ];
        } else {
          query.justificativa = {
            $regex: filtros.justificativa,
            $options: "i",
          };
        }
      }

      if (filtros.dia || filtros.mes || filtros.ano) {
        query.$expr = { $and: [] };

        if (filtros.dia) {
          query.$expr.$and.push({
            $eq: [{ $dayOfMonth: "$dataHora" }, Number(filtros.dia)],
          });
        }

        if (filtros.mes) {
          query.$expr.$and.push({
            $eq: [{ $month: "$dataHora" }, Number(filtros.mes)],
          });
        }

        if (filtros.ano) {
          query.$expr.$and.push({
            $eq: [{ $year: "$dataHora" }, Number(filtros.ano)],
          });
        }
      }

      return await Log.find(query).sort({ dataHora: -1 });
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      throw new Error('Erro ao buscar logs');
    }
  }

  async getLogById(id) {
    try {
      return await Log.findById(id);
    } catch (error) {
      console.error('Erro ao buscar log por ID:', error);
      throw new Error('Erro ao buscar log por ID');
    }
  }
}

export default new LogService();

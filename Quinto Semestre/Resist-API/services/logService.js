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

  async getAllLogs() {
    try {
      return await Log.find().sort({ dataHora: -1 });
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
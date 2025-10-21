import Log from '../models/Log.js';

class LogService {

  async createLog(autor, acao, alvo, justificativa) {
    try {
      if (!autor || !acao || !alvo) {
        console.error('Log Service Error: autor, acao, and alvo are required to create a log.');
        return;
      }

      await Log.create({ autor, acao, alvo, justificativa });
    } catch (error) {
      // Only log to console to prevent crashes from logging failures.
      console.error('Erro ao criar log no histórico: ', error);
    }
  }
}

export default new LogService();
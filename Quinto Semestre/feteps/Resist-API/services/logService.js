import Log from '../models/Log.js';

class LogService {
  async createLog(autor, alvo, acao, justificativa) {
    try {
      if (!autor || !acao || !alvo) {
        console.error('Log Service Error: autor, acao, and alvo are required to create a log.', autor, alvo, acao);
        return;
      }
      await Log.create({ autor, acao, alvo, justificativa });
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
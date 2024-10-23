import Indexacao from "../models/Index.js"; // Importa o modelo de indexação

// Classe responsável pelos serviços de indexação
class IndexacaoService {
  // Método para obter todas as indexações
  async getAll() {
    try {
      const indexacoes = await Indexacao.find(); // Busca todas as indexações
      return indexacoes; // Retorna as indexações encontradas
    } catch (error) {
      console.error("Erro ao buscar indexações:", error); // Loga o erro no console
      throw new Error("Erro ao buscar indexações"); // Relança o erro com uma mensagem mais clara
    }
  }

  // Método para obter acessos por mês
  async getAcessosPorMes() {
    try {
      const acessosPorMes = await Indexacao.aggregate([
        {
          $addFields: {
            laboratorio: this.getLaboratorio("$ipMaquina"), // Adiciona o laboratório baseado no IP
            tipo_dispositivo: this.getTipoDispositivo("$ipMaquina"), // Adiciona o tipo de dispositivo baseado no IP
          },
        },
        {
          $group: {
            _id: { $month: "$dataHora" }, // Agrupa os resultados pelo mês
            contagem_disp_movel: {
              $sum: {
                $cond: [{ $eq: ["$laboratorio", "Laboratório Móvel"] }, 1, 0], // Conta acessos de dispositivos móveis
              },
            },
            contagem_desktop: {
              $sum: {
                $cond: [{ $ne: ["$laboratorio", "Laboratório Móvel"] }, 1, 0], // Conta acessos de desktops
              },
            },
            total_acessos: { $sum: 1 }, // Conta total de acessos
          },
        },
        {
          $project: {
            mes_acesso: "$_id", // Renomeia o campo de mês
            contagem_disp_movel: 1,
            contagem_desktop: 1,
            total_acessos: 1,
          },
        },
        { $sort: { mes_acesso: 1 } }, // Ordena por mês de acesso
      ]);

      return acessosPorMes; // Retorna os acessos por mês
    } catch (error) {
      console.error("Erro ao buscar acessos por mês:", error); // Loga o erro no console
      throw new Error("Erro ao buscar acessos por mês"); // Relança o erro com uma mensagem mais clara
    }
  }

  // Método para obter bloqueios
  async getBloqueio() {
    try {
      const bloqueios = await Indexacao.aggregate([
        {
          $match: { flag: true }, // Filtra apenas os registros com bloqueio
        },
        {
          $group: {
            _id: "$urlWeb", // Agrupa por URL
            data_hora: { $last: "$dataHora" }, // Obtém a última data e hora de bloqueio
          },
        },
        {
          $project: {
            URL: "$_id", // Renomeia o campo de URL
            DataHora: "$data_hora", // Renomeia o campo de data e hora
          },
        },
        { $sort: { DataHora: -1 } }, // Ordena por data e hora de bloqueio, do mais recente para o mais antigo
      ]);

      return bloqueios; // Retorna os bloqueios encontrados
    } catch (error) {
      console.error("Erro ao buscar bloqueios:", error); // Loga o erro no console
      throw new Error("Erro ao buscar bloqueios"); // Relança o erro com uma mensagem mais clara
    }
  }

  // Função auxiliar para determinar o laboratório com base no IP
  getLaboratorio(ipField) {
    return {
      $switch: {
        branches: [
          {
            case: {
              $and: [
                { $gte: [{ $toLong: { $toIp: ipField } }, { $toLong: { $toIp: "192.168.1.1" } }] },
                { $lte: [{ $toLong: { $toIp: ipField } }, { $toLong: { $toIp: "192.168.1.30" } }] },
              ],
            },
            then: "Laboratório 1", // Laboratório 1
          },
          // Adicione os outros laboratórios seguindo o mesmo padrão...
        ],
        default: "Outro Laboratório", // Valor padrão se nenhum laboratório corresponder
      },
    };
  }

  // Função auxiliar para determinar o tipo de dispositivo
  getTipoDispositivo(ipField) {
    return {
      $cond: {
        if: { $gte: [{ $toLong: { $toIp: ipField } }, { $toLong: { $toIp: "192.168.1.211" } }] },
        then: "Disp. Móveis", // Se o IP estiver na faixa, é um dispositivo móvel
        else: "Desktop", // Caso contrário, é um desktop
      },
    };
  }
}

// Exporta uma instância única do IndexacaoService
export default new IndexacaoService();

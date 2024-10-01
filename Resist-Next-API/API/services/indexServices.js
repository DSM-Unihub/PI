import Indexacao from "../models/Index.js";

class IndexacaoService {
  async getAll() {
    try {
      const indexacoes = await Indexacao.find();
      return indexacoes;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao buscar indexações");
    }
  }

  async getAcessosPorMes() {
    try {
      const acessosPorMes = await Indexacao.aggregate([
        {
          $addFields: {
            laboratorio: {
              $switch: {
                branches: [
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.1" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.30" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório 1",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.31" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.60" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório 2",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.61" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.90" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório 3",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.91" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.120" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório 4",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.121" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.150" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório 5",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.151" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.180" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório 6",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.181" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.210" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório Móvel",
                  },
                  {
                    case: {
                      $and: [
                        {
                          $gte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "192.168.1.211" } },
                          ],
                        },
                        {
                          $lte: [
                            { $toLong: { $toIp: "$ipMaquina" } },
                            { $toLong: { $toIp: "255.255.255.255" } },
                          ],
                        },
                      ],
                    },
                    then: "Laboratório Professores",
                  },
                ],
                default: "Outro Laboratório",
              },
            },
            tipo_dispositivo: {
              $cond: {
                if: {
                  $gte: [
                    { $toLong: { $toIp: "$ipMaquina" } },
                    { $toLong: { $toIp: "192.168.1.211" } },
                  ],
                },
                then: "Disp. Móveis",
                else: "Desktop",
              },
            },
          },
        },
        {
          $group: {
            _id: { $month: "$dataHora" },
            contagem_disp_movel: {
              $sum: {
                $cond: [{ $eq: ["$laboratorio", "Laboratório Móvel"] }, 1, 0],
              },
            },
            contagem_desktop: {
              $sum: {
                $cond: [{ $ne: ["$laboratorio", "Laboratório Móvel"] }, 1, 0],
              },
            },
            total_acessos: { $sum: 1 },
          },
        },
        {
          $project: {
            mes_acesso: "$_id",
            contagem_disp_movel: 1,
            contagem_desktop: 1,
            total_acessos: 1,
          },
        },
        { $sort: { mes_acesso: 1 } },
      ]);

      return acessosPorMes;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao buscar acessos por mês");
    }
  }

  async getBloqueio() {
    try {
      const bloqueios = await Indexacao.aggregate([
        {
          $match: { flag: true },
        },
        {
          $group: {
            _id: "$urlWeb",
            data_hora: { $last: "$dataHora" }, // Para pegar a última data
          },
        },
        {
          $project: {
            URL: "$_id",
            DataHora: "$data_hora",
          },
        },
        { $sort: { DataHora: -1 } },
      ]);

      return bloqueios;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao buscar bloqueios");
    }
  }
  
}

export default new IndexacaoService();

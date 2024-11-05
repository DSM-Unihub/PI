import Indexacao from "../models/Indexacao.js";

// Função para obter estatísticas de bloqueios por mês e laboratório
export const EstatisticasBloqueios = async () => {
  try {
    const pipeline = [
      {
        $match: { flag: true }, // Apenas acessos bloqueados
      },
      {
        $addFields: {
          laboratorio: {
            $switch: {
              branches: [
                {
                  case: {
                    $regexMatch: {
                      input: "$ipMaquina",
                      regex: /^192\.168\.1\.(1[0-9]|2[0-9]|30)$/,
                    },
                  },
                  then: "Laboratório 1",
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$ipMaquina",
                      regex: /^192\.168\.1\.(3[1-9]|[4-5][0-9]|60)$/,
                    },
                  },
                  then: "Laboratório 2",
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$ipMaquina",
                      regex: /^192\.168\.1\.(6[1-9]|7[0-9]|80|90)$/,
                    },
                  },
                  then: "Laboratório 3",
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$ipMaquina",
                      regex: /^192\.168\.1\.(9[1-9]|[1-9][0-9]|120)$/,
                    },
                  },
                  then: "Laboratório 4",
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$ipMaquina",
                      regex: /^192\.168\.1\.(1[2-4][0-9]|150)$/,
                    },
                  },
                  then: "Laboratório Mobile",
                },
                {
                  case: {
                    $regexMatch: {
                      input: "$ipMaquina",
                      regex: /^192\.168\.1\.(2[1-4][0-9])$/,
                    },
                  },
                  then: "Laboratório Professores",
                },
              ],
              default: "Outro Laboratório",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            mes: { $month: "$dataHora" },
            ano: { $year: "$dataHora" },
            laboratorio: "$laboratorio",
          },
          bloqueiosPorLaboratorio: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: { mes: "$_id.mes", ano: "$_id.ano" },
          totalBloqueiosMes: { $sum: "$bloqueiosPorLaboratorio" },
          bloqueiosPorLaboratorio: {
            $push: {
              laboratorio: "$_id.laboratorio",
              bloqueios: "$bloqueiosPorLaboratorio",
              porcentagem: {
                $multiply: [
                  {
                    $divide: ["$bloqueiosPorLaboratorio", "$totalBloqueiosMes"],
                  },
                  100,
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          mes: "$_id.mes",
          ano: "$_id.ano",
          totalBloqueiosMes: 1,
          bloqueiosPorLaboratorio: 1,
          _id: 0,
        },
      },
      { $sort: { ano: 1, mes: 1 } },
    ];

    return await Indexacao.aggregate(pipeline);
  } catch (error) {
    console.error("Erro ao calcular estatísticas de bloqueios:", error);
    throw new Error("Erro ao obter estatísticas de bloqueios");
  }
};

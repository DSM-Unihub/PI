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
            },
          },
        },
      },
      {
        $addFields: {
          bloqueiosPorLaboratorio: {
            $map: {
              input: "$bloqueiosPorLaboratorio",
              as: "item",
              in: {
                laboratorio: "$$item.laboratorio",
                bloqueios: "$$item.bloqueios",
                porcentagem: {
                  $cond: {
                    if: { $eq: ["$totalBloqueiosMes", 0] },
                    then: 0,
                    else: {
                      $round: [
                        {
                          $multiply: [
                            {
                              $divide: ["$$item.bloqueios", "$totalBloqueiosMes"],
                            },
                            100,
                          ],
                        },
                        2, // Arredondando para 2 casas decimais
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      
      {
        // Ordenando os laboratórios dentro do array de cada mês/ano
        $addFields: {
          bloqueiosPorLaboratorio: {
            $sortArray: {
              input: "$bloqueiosPorLaboratorio",
              sortBy: { laboratorio: 1 }, // Ordena os laboratórios em ordem alfabética
            },
          },
        },
      },
      {
        // Recupera as últimas atividades de inserção
        $lookup: {
          from: "indexacaos", // Nome da coleção de atividades de inserção
          pipeline: [
            {
              $project: {
                tipoInsercao: 1, // Tipo de inserção: manual ou automático
                dataHora: 1,     // Data da inserção
              },
            },
            { $sort: { dataHora: -1 } }, // Ordena pela data de inserção mais recente
            { $limit: 5 }, // Limita para as últimas 5 atividades
          ],
          as: "ultimasAtividades", // Inclui as atividades no resultado final
        },
      },
      {
        $lookup: {
          from: "indexacaos", // Nome da coleção de atividades de inserção
          pipeline: [
            {
              $project: {
                tipoInsercao: 1, // Tipo de inserção: manual ou automático
                dataHora: {
                  $dateToString: {
                    format: "%d/%m/%Y", // Formato de data sem a hora
                    date: "$dataHora",  // Campo dataHora
                  },
                },
           // Data da inserção
              },
            },
            { $sort: { dataHora: -1 } }, // Ordena pela data de inserção mais recente
            { $limit: 5 }, // Limita para as últimas 5 atividades
          ],
          as: "ultimasAtividades", // Inclui as atividades no resultado final
        },
      },
      {
        $project: {
          mes: "$_id.mes",
          ano: "$_id.ano",
          totalBloqueiosMes: 1,
          bloqueiosPorLaboratorio: 1,
          ultimasAtividades: 1, // Inclui as últimas atividades de inserção
          _id: 0,
        },
      },
      {
        // Adicionando uma etapa de verificação para depuração
        $addFields: {
          ultimasAtividadesCheck: {
            $cond: {
              if: { $eq: [{ $size: "$ultimasAtividades" }, 0] },
              then: "Sem atividades de inserção", // Mensagem para caso não encontre atividades
              else: "Atividades encontradas",
            },
          },
        },
      },
      // Ordenando os dados finais por ano e mês
      { $sort: { "ano": 1, "mes": 1 } },
    ];

    return await Indexacao.aggregate(pipeline);
  } catch (error) {
    console.error("Erro ao calcular estatísticas de bloqueios:", error);
    throw new Error("Erro ao obter estatísticas de bloqueios");
  }
};

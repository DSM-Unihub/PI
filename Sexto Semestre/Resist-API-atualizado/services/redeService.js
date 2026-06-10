import Rede from "../models/rede.js";
import Indexacao from "../models/Indexacao.js";

class RedeService {
  async create(data) {
    try {
      const rede = new Rede(data);
      return await rede.save();
    } catch (error) {
      console.error("Erro ao criar registro de rede:", error);
      throw new Error("Erro ao criar registro de rede");
    }
  }

  async getAll(filtros = {}) {
    try {
      const query = {};

      if (filtros.nome) {
        query.nome = {
          $regex: filtros.nome,
          $options: "i",
        };
      }

      if (filtros.ipStart) {
        query.ipStart = filtros.ipStart;
      }

      if (filtros.ipEnd) {
        query.ipEnd = filtros.ipEnd;
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

      return await Rede.find(query).sort({ dataHora: -1 });
    } catch (error) {
      console.error("Erro ao buscar rede:", error);
      throw new Error("Erro ao buscar rede");
    }
  }

  async deleteById(id) {
    try {
      return await Rede.findByIdAndDelete(id);
    } catch (error) {
      console.error("Erro ao deletar rede:", error);
      throw new Error("Erro ao deletar rede");
    }
  }

  async getIncidenciaPorRede(filtros = {}) {
  try {
    const redes = await Rede.find();

    const ipToNumber = (ip) =>
      ip.split(".").reduce(
        (acc, oct) => (acc << 8) + Number(oct),
        0
      );

    let filtroData = {};

    if (
      filtros.dia ||
      filtros.mes ||
      filtros.ano
    ) {
      filtroData.$expr = {
        $and: [],
      };

      if (filtros.dia) {
        filtroData.$expr.$and.push({
          $eq: [
            { $dayOfMonth: "$dataHora" },
            Number(filtros.dia),
          ],
        });
      }

      if (filtros.mes) {
        filtroData.$expr.$and.push({
          $eq: [
            { $month: "$dataHora" },
            Number(filtros.mes),
          ],
        });
      }

      if (filtros.ano) {
        filtroData.$expr.$and.push({
          $eq: [
            { $year: "$dataHora" },
            Number(filtros.ano),
          ],
        });
      }
    }

    const indexacoes = await Indexacao.find(
      filtroData
    );

    const totalBloqueios =
      indexacoes.length || 1;

    const resultado = redes.map((rede) => {
      const startIp = ipToNumber(
        rede.ipStart
      );

      const endIp = ipToNumber(
        rede.ipEnd
      );

      const bloqueiosRede =
        indexacoes.filter((indexacao) => {
          if (!indexacao.ipMaquina)
            return false;

          const ipAtual =
            ipToNumber(
              indexacao.ipMaquina
            );

          return (
            ipAtual >= startIp &&
            ipAtual <= endIp
          );
        });

      const quantidadeBloqueios =
        bloqueiosRede.length;

      const porcentagem = Math.round(
        (quantidadeBloqueios /
          totalBloqueios) *
          100
      );

      let cor = "#22C55E";

      if (porcentagem >= 70) {
        cor = "#EF4444";
      } else if (
        porcentagem >= 40
      ) {
        cor = "#F59E0B";
      }

      return {
        id: rede._id,
        nome: rede.nome,
        quantidadeBloqueios,
        porcentagem,
        cor,
      };
    });

    return resultado.sort(
      (a, b) =>
        b.quantidadeBloqueios -
        a.quantidadeBloqueios
    );
  } catch (error) {
    console.error(
      "Erro ao buscar incidência:",
      error
    );

    throw new Error(
      "Erro ao buscar incidência por rede"
    );
  }
  }

  async getEstatisticasBloqueios(
  ano
) {
  try {
    const inicio =
      new Date(
        Number(ano),
        0,
        1
      );

    const fim =
      new Date(
        Number(ano),
        11,
        31,
        23,
        59,
        59
      );

    const indexacoes =
      await Indexacao.find({
        dataHora: {
          $gte: inicio,
          $lte: fim,
        },
      });

    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const mesesLongo = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const dados =
      Array.from(
        { length: 12 },
        (_, i) => ({
          mes: meses[i],
          bloqueios: 0,
          desbloqueios: 0,
        })
      );

    indexacoes.forEach(
      (item) => {
        const mes =
          new Date(
            item.dataHora
          ).getMonth();

        if (
          item.flag ===
          false
        ) {
          dados[
            mes
          ].bloqueios++;
        } else {
          dados[
            mes
          ]
            .desbloqueios++;
        }
      }
    );

    const block =
      dados.map(
        (
          item,
          index
        ) => {
          const totalAtual =
            item.bloqueios +
            item.desbloqueios;

          const mesAnterior =
            dados[
              index - 1
            ];

          const totalAnterior =
            mesAnterior
              ? mesAnterior.bloqueios +
                mesAnterior.desbloqueios
              : 0;

          let porcentagem = 0;

          if (
            totalAnterior >
            0
          ) {
            porcentagem =
              (
                ((totalAtual -
                  totalAnterior) /
                  totalAnterior) *
                100
              ).toFixed(
                0
              );
          }

          return {
            mes:
              mesesLongo[
                index
              ],
            bloqueios:
              item.bloqueios,
            desbloqueios:
              item.desbloqueios,
            porcentMesPassado:
              `${
                porcentagem >=
                0
                  ? "+"
                  : ""
              }${porcentagem}%`,
            flag:
              porcentagem >=
              0
                ? 1
                : 2,
          };
        }
      );

    return {
      dados,
      block,
    };
  } catch (error) {
    console.error(
      "Erro estatísticas:",
      error
    );

    throw new Error(
      "Erro ao buscar estatísticas"
    );
  }
}
async getUltimosBloqueios(
  limite = 8
) {
  try {
    const redes =
      await Rede.find();

    const bloqueios =
      await Indexacao.find()
        .sort({
          dataHora: -1,
        })
        .limit(
          Number(limite)
        );

    const dados =
      bloqueios.map(
        (item) => {
          const redeEncontrada =
            redes.find(
              (
                rede
              ) => {
                const ipNumero =
                  item.ipMaquina
                    .split(
                      "."
                    )
                    .reduce(
                      (
                        acc,
                        oct
                      ) =>
                        (acc <<
                          8) +
                        Number(
                          oct
                        ),
                      0
                    );

                const start =
                  rede.ipStart
                    .split(
                      "."
                    )
                    .reduce(
                      (
                        acc,
                        oct
                      ) =>
                        (acc <<
                          8) +
                        Number(
                          oct
                        ),
                      0
                    );

                const end =
                  rede.ipEnd
                    .split(
                      "."
                    )
                    .reduce(
                      (
                        acc,
                        oct
                      ) =>
                        (acc <<
                          8) +
                        Number(
                          oct
                        ),
                      0
                    );

                return (
                  ipNumero >=
                    start &&
                  ipNumero <=
                    end
                );
              }
            );

          return {
            tipoBlock:
              item.tipoInsercao ===
              "Manual"
                ? 1
                : 2,

            dataHora:
              item.dataHora,

            nomeDispo:
              item.ipMaquina,

            laboraDisp:
              redeEncontrada?.nome ||
              "Sem rede",
          };
        }
      );

    return dados;
  } catch (error) {
    console.error(
      error
    );

    throw new Error(
      "Erro ao buscar últimos bloqueios"
    );
  }
}
}

export default new RedeService();

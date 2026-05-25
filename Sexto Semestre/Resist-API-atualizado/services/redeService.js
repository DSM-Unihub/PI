import Rede from "../models/rede.js";

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
}

export default new RedeService();

import Indexacao from "../models/Indexacao.js";

class indexacaoService{
  async getBloqueiosPorMesesAno() {
    try {
      const dataAtual = new Date();
      const anoAtual = dataAtual.getFullYear();

      const obterNomeMes = (mes) => {
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return meses[mes - 1];
      };

      // Agrupamento e contagem de bloqueios por mês do ano atual
      const bloqueiosPorMes = await Indexacao.aggregate([
        {
          $match: {
            flag: true,
            dataHora: {
              $gte: new Date(anoAtual, 0, 1), // Início do ano atual
              $lt: new Date(anoAtual + 1, 0, 1) // Início do próximo ano
            }
          }
        },
        {
          $group: {
            _id: {
              mes: { $month: "$dataHora" },
              tipo: {
                $cond: [
                  { $eq: ["$laboratorio", "Laboratório Mobile"] },
                  "Mobile",
                  "Desktop"
                ]
              }
            },
            totalBloqueios: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.mes",
            bloqueios: {
              $push: {
                tipo: "$_id.tipo",
                total: "$totalBloqueios"
              }
            },
            totalMensal: { $sum: "$totalBloqueios" }
          }
        },
        {
          $sort: { "_id": 1 } // Ordena pelos meses do ano
        }
      ]);

      // Estruturação dos dados e cálculo de variação mensal
      const dadosMensais = bloqueiosPorMes.map((item, index, arr) => {
        const mesAtual = item._id;
        const totalDesktop = item.bloqueios.find(b => b.tipo === "Desktop")?.total || 0;
        const totalMobile = item.bloqueios.find(b => b.tipo === "Mobile")?.total || 0;
        const totalBloqueios = item.totalMensal;
        
        // Cálculo da variação em relação ao mês anterior
        const totalMesAnterior = index > 0 ? arr[index - 1].totalMensal : 0;
        const variacao = totalMesAnterior
          ? ((totalBloqueios - totalMesAnterior) / totalMesAnterior) * 100
          : 0;

        return {
          mes: obterNomeMes(mesAtual),
          ano: anoAtual,
          totalBloqueios,
          desktopBloqueios: totalDesktop,
          mobileBloqueios: totalMobile,
          porcentagemVariacaoMesAnterior: variacao.toFixed(2)
        };
      });

      return dadosMensais;
    } catch (error) {
      console.error("Erro ao obter bloqueios por meses do ano:", error);
      throw new Error("Erro ao obter bloqueios por meses do ano");
    }
  }

  async getAllBlocks() {
    try {
      // Removido o filtro de flag para retornar todas as indexações
      const bloqueios = await Indexacao.find();
      return bloqueios;
    } catch (error) {
      console.error("Erro ao buscar todos os bloqueios:", error);
      throw new Error("Erro ao buscar todos os bloqueios");
    }
  }

  async getEstatisticasLabs(){
    try {
      // Obtenha todos os registros de bloqueios
      const bloqueios = await Indexacao.find({ flag: true });
      
      const laboratorios = {
        "Laboratório 1": /^192\.168\.1\.(1[0-9]|2[0-9]|30)$/,
        "Laboratório 2": /^192\.168\.1\.(3[1-9]|[4-5][0-9]|60)$/,
        "Laboratório 3": /^192\.168\.1\.(6[1-9]|7[0-9]|80|90)$/,
        "Laboratório 4": /^192\.168\.1\.(9[1-9]|[1-9][0-9]|120)$/,
        "Laboratório Mobile": /^192\.168\.1\.(1[2-4][0-9]|150)$/,
        "Laboratório Professores": /^192\.168\.1\.(2[1-4][0-9])$/,
        "Outro Laboratório": /.*/,
      };
  
      // Inicializa o contador de bloqueios para cada laboratório
      const contagemLaboratorios = {};
      let totalBloqueios = 0;
  
      // Classifica os bloqueios por laboratório e calcula o total
      bloqueios.forEach((bloqueio) => {
        const laboratorio = Object.keys(laboratorios).find((lab) =>
          laboratorios[lab].test(bloqueio.ipMaquina)
        );
  
        if (!contagemLaboratorios[laboratorio]) {
          contagemLaboratorios[laboratorio] = 0;
        }
        contagemLaboratorios[laboratorio]++;
        totalBloqueios++;
      });
  
      // Calcula a porcentagem de bloqueios para cada laboratório
      const estatisticasLaboratorios = Object.keys(contagemLaboratorios).map((lab) => {
        const bloqueios = contagemLaboratorios[lab];
        const porcentagem = ((bloqueios / totalBloqueios) * 100).toFixed(2);
        return { laboratorio: lab, bloqueios, porcentagem };
      });
  
      return { totalBloqueios, estatisticasLaboratorios };
    } catch (error) {
      console.error("Erro ao calcular bloqueios por laboratório:", error);
      throw new Error("Erro ao obter bloqueios por laboratório");
    }
  };

  async getUltimasAtividades(){
    try {
      const dataAtual = new Date();
      const inicioMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
  
      const atividades = await Indexacao.find({
        dataHora: { $gte: inicioMes },
      })
        .sort({ dataHora: -1 }) // Ordena da mais recente para a mais antiga
        .limit(5)
        .select("tipoInsercao dataHora"); // Seleciona apenas o tipo de inserção e data
  
      // Formata a data no formato dia/mês/ano
      const atividadesFormatadas = atividades.map((atividade) => ({
        tipoInsercao: atividade.tipoInsercao,
        data: atividade.dataHora.toLocaleDateString("pt-BR"),
      }));
  
      return atividadesFormatadas;
    } catch (error) {
      console.error("Erro ao obter as últimas atividades:", error);
      throw new Error("Erro ao obter as últimas atividades");
    }
  }


  // Função para obter as estatísticas de bloqueios
 async getEstatisticasMensais(){
  try {
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const mesAtual = dataAtual.getMonth() + 1;

    // Função auxiliar para formatar o mês como nome
    const obterNomeMes = (mes) => {
      const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      return meses[mes - 1];
    };

    // Consulta para os últimos três meses
    const [dadosMesAtual, dadosMesAnterior, dadosDoisMesesAtras] = await Promise.all([
      Indexacao.countDocuments({
        flag: true,
        dataHora: {
          $gte: new Date(anoAtual, mesAtual - 1, 1),
          $lt: new Date(anoAtual, mesAtual, 1)
        }
      }),
      Indexacao.countDocuments({
        flag: true,
        dataHora: {
          $gte: new Date(anoAtual, mesAtual - 2, 1),
          $lt: new Date(anoAtual, mesAtual - 1, 1)
        }
      }),
      Indexacao.countDocuments({
        flag: true,
        dataHora: {
          $gte: new Date(anoAtual, mesAtual - 3, 1),
          $lt: new Date(anoAtual, mesAtual - 2, 1)
        }
      })
    ]);

    // Cálculo da média móvel dos últimos três meses
    const totalBloqueiosTresMeses = dadosMesAtual + dadosMesAnterior + dadosDoisMesesAtras;
    const mediaMovelTresMeses = totalBloqueiosTresMeses / 3;

    // Cálculo das variações de percentual
    const variacaoMesAnterior = dadosMesAnterior
      ? ((dadosMesAtual - dadosMesAnterior) / dadosMesAnterior) * 100
      : 0;
    
    // Variação Total considerando os três meses: Novembro vs (Setembro + Outubro)
    const totalDosTresMeses = dadosMesAnterior + dadosDoisMesesAtras;
    let variacaoTotal = 0;
    if (totalDosTresMeses > 0) {
      variacaoTotal = ((dadosMesAtual - totalDosTresMeses) / totalDosTresMeses) * 100;
    }

    return {
      mesAtual: {
        mes: obterNomeMes(mesAtual),
        ano: anoAtual,
        bloqueios: dadosMesAtual
      },
      mesAnterior: {
        mes: obterNomeMes(mesAtual - 1),
        ano: anoAtual,
        bloqueios: dadosMesAnterior
      },
      doisMesesAtras: {
        mes: obterNomeMes(mesAtual - 2),
        ano: anoAtual,
        bloqueios: dadosDoisMesesAtras
      },
      porcentagemVariacaoMesAnterior: variacaoMesAnterior.toFixed(2),
      porcentagemVariacaoTotal: variacaoTotal.toFixed(2),
      mediaMovelTresMeses: mediaMovelTresMeses.toFixed(2) // Média móvel dos três meses
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas mensais:", error);
    throw new Error("Erro ao obter estatísticas mensais");
  }
}

async createBlock(data) {
  try {
    // Validação dos dados necessários
    if (!data.url) {
      throw new Error("URL é obrigatória");
    }

    // Garante que todos os campos necessários estejam presentes
    const bloqueioData = {
      url: data.url,
      motivo: data.motivo || "Bloqueio Manual",
      periodo: data.periodo || "Indefinido",
      tipoInsercao: data.tipoInsercao || "Manual",
      ipMaquina: data.ipMaquina || "192.168.1.1",
      urlWeb: data.urlWeb || data.url,
      dataHora: data.dataHora || new Date(),
      flag: data.flag !== undefined ? data.flag : true
    };

    // Cria um novo bloqueio no banco de dados
    const novoBloqueio = new Indexacao(bloqueioData);
    const bloqueioSalvo = await novoBloqueio.save();
    
    if (!bloqueioSalvo) {
      throw new Error("Falha ao salvar o bloqueio");
    }

    return bloqueioSalvo;
  } catch (error) {
    console.error("Erro ao criar bloqueio:", error);
    throw new Error(error.message || "Erro ao criar bloqueio");
  }
}

async updateBlock(id, data) {
  try {
    // Encontra o bloqueio pelo ID e atualiza os dados
    const bloqueioAtualizado = await Indexacao.findByIdAndUpdate(id, data, { new: true });
    if (!bloqueioAtualizado) {
      throw new Error("Bloqueio não encontrado");
    }
    return bloqueioAtualizado;
  } catch (error) {
    console.error("Erro ao atualizar bloqueio:", error);
    throw new Error("Erro ao atualizar bloqueio");
  }
}

async deleteBlock(id) {
  try {
    // Encontra o bloqueio pelo ID e remove-o
    const bloqueioExcluido = await Indexacao.findByIdAndDelete(id);
    if (!bloqueioExcluido) {
      throw new Error("Bloqueio não encontrado");
    }
    return bloqueioExcluido;
  } catch (error) {
    console.error("Erro ao excluir bloqueio:", error);
    throw new Error("Erro ao excluir bloqueio");
  }
}

}

export default new indexacaoService();
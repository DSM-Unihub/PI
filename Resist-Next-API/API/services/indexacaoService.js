import Indexacao from "../models/Indexacao.js";

class indexacaoService{
  
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

    // Calcular as variações de percentual
    const variacaoMesAnterior = dadosMesAnterior
      ? ((dadosMesAtual - dadosMesAnterior) / dadosMesAnterior) * 100
      : 0;
    
    // Variação Total considerando os três meses: Novembro vs (Setembro + Outubro)
    const totalDosTresMeses = dadosMesAnterior + dadosDoisMesesAtras;
    let variacaoTotal = 0;
    if (totalDosTresMeses > 0) {
      variacaoTotal = ((dadosMesAtual - totalDosTresMeses) / totalDosTresMeses) * 100;
    }

    // Se a variação total for 0, exibe uma mensagem específica
    const variacaoTotalMensagem = variacaoTotal === 0 ? "Nenhuma Variação" : variacaoTotal.toFixed(2);

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
      porcentagemVariacaoTotal: variacaoTotalMensagem // Exibe a mensagem ou o valor de variação total
    };
  } catch (error) {
    console.error("Erro ao obter estatísticas mensais:", error);
    throw new Error("Erro ao obter estatísticas mensais");
  }
  };
}

export default new indexacaoService();
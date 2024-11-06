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
}

export default new indexacaoService();
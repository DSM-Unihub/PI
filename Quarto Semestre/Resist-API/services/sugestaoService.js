import Sugestao from '../models/sugestao.js';
import User from '../models/user.js'
import Indexacao from '../models/Indexacao.js';
import atualizarArquivoBloqueados from '../utils/arquivoBloqueados.js';
import indexacaoService from './indexacaoService.js';

class SugestaoService {

  async createSugestao(data) {
    try{
      if(!data.url || !data.idUser){
        throw new Error("Campos obrigatórios não preenchidos");
        return null
      }
      const sugestaoDatas= {
        idUser: data.idUser,
        dataHora: new Date(),
        url: data.url,
        motivo: data.motivo || "Valor não preenchido",
        tipo: data.tipo,
        situacao: 'Pendente',
        foto: data.foto || " "
    };
    const novaSuGestao = new Sugestao(sugestaoDatas)
    return await novaSuGestao.save();

    }catch(error){
      console.log(error)
    }
  
  }

  async getAll() {
    try{
      const sugestao =await Sugestao.find()
      return sugestao;
    } catch(error){
      console.log(error)
    }
  }

async getOne(id) {
  try {
    const sugestao = await Sugestao.findById(id).lean(); // .lean() para retornar um objeto simples
    const user = await User.findById(sugestao.idUser).lean();

    return {
      ...sugestao,
      nome: user.nome,
      email: user.email
    };
  } catch (error) {
    console.log(error);
  }
}


  async update(id, idUser, url, motivo, tipo, situacao, foto) {
    try {
      const sugestaoAntiga = await Sugestao.findById(id);
      if (!sugestaoAntiga) {
        throw new Error("Sugestão não encontrada");
      }

      const sugestaoAtualizada = await Sugestao.findByIdAndUpdate(
        id,
        { idUser, url, motivo, tipo, situacao, foto },
        { new: true }
      );

      if (!sugestaoAtualizada) {
        throw new Error("Erro ao atualizar sugestão");
      }

      // Se a situação foi alterada para Aceito
      if (sugestaoAtualizada.situacao === 'Aceito') {
        try {
          // Tenta encontrar uma indexação existente
          const indexacaoExistente = await indexacaoService.getIndexacaoByUrl(sugestaoAtualizada.url);
          
          // Se encontrou, atualiza a flag baseado no tipo
          if (indexacaoExistente) {
            await Indexacao.updateMany(
              { urlWeb: sugestaoAtualizada.url },
              { $set: { flag: sugestaoAtualizada.tipo } } // tipo é true/false
            );
          } else {
            // Se não encontrou, cria uma nova indexação
            await indexacaoService.createBlock({
              url: sugestaoAtualizada.url,
              motivo: sugestaoAtualizada.motivo,
              tipoInsercao: "Manual",
              flag: sugestaoAtualizada.tipo, // tipo é true/false
              urlWeb: sugestaoAtualizada.url
            });
          }

          // Atualiza o arquivo de bloqueados
          await atualizarArquivoBloqueados(
            sugestaoAtualizada.url,
            sugestaoAtualizada.tipo // tipo é true/false
          );

          console.log("Sugestão aceita: Indexação e arquivo bloqueados atualizados com sucesso.");
        } catch (error) {
          console.error("Erro ao processar indexação:", error);
          // Não propaga o erro para não afetar a atualização da sugestão
        }
      } else if (sugestaoAtualizada.situacao === 'Recusado') {
        console.log("Sugestão recusada: Nenhuma ação tomada na indexação nem no arquivo.");
      }

      return sugestaoAtualizada;
    } catch (error) {
      console.error("Erro ao atualizar sugestão:", error);
      throw error;
    }
  }
}

export default new SugestaoService();
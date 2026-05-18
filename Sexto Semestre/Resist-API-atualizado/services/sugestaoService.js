import Sugestao from '../models/sugestao.js';
import User from '../models/user.js'
import Indexacao from '../models/Indexacao.js';
import indexacaoService from './indexacaoService.js';
import logService from './logService.js';

class SugestaoService {
  normalizeLookupUrl(url) {
    const raw = String(url || '').trim().toLowerCase();
    return raw
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/+$/, '');
  }

  normalizeFrasesPayload(frases) {
    if (!Array.isArray(frases)) return [];
    return frases
      .map((item) => {
        if (typeof item === 'string') {
          const texto = item.trim();
          return texto ? { texto, ofensiva: true } : null;
        }
        if (item && typeof item === 'object') {
          const texto = String(item.texto || '').trim();
          if (!texto) return null;
          const categoriaRaw = item.categoria || item.motivo || item.label || item.class;
          const categoria = categoriaRaw ? String(categoriaRaw).trim() : null;
          return {
            texto,
            ofensiva: item.ofensiva !== undefined ? Boolean(item.ofensiva) : true,
            categoria: categoria || null,
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  async createSugestao(data) {
    try{
      if(!data.url || !data.idUser){
        throw new Error("Campos obrigatórios não preenchidos");
      }
      const sugestaoDatas= {
        idUser: data.idUser,
        dataHora: new Date(),
        url: data.url,
        motivo: data.motivo || "Valor não preenchido",
        frases: this.normalizeFrasesPayload(data.frases),
        tipo: data.tipo,
        situacao: data.situacao || "Pendente",
        foto: data.foto || ""
    };
    const novaSuGestao = new Sugestao(sugestaoDatas)
    await novaSuGestao.save();

    if (novaSuGestao.situacao === 'Aceito') {
        try {
          // Tenta encontrar uma indexação existente
          const indexacaoExistente = await indexacaoService.getIndexacaoByUrl(novaSuGestao.url);
          
          // Se encontrou, atualiza a flag baseado no tipo
          if (indexacaoExistente) {
            await Indexacao.updateMany(
              { urlWeb: novaSuGestao.url },
              { $set: { flag: novaSuGestao.tipo } } // tipo é true/false
            );
          } else {
            // Se não encontrou, cria uma nova indexação
            await indexacaoService.createBlock({
              url: novaSuGestao.url,
              motivo: novaSuGestao.motivo,
              frases: novaSuGestao.frases || [],
              tipoInsercao: "Manual",
              flag: novaSuGestao.tipo, // tipo é true/false
              urlWeb: novaSuGestao.url
            });
          }

          if(novaSuGestao.tipo === true){
            await logService.createLog(
              idAdmin,
              novaSuGestao.url,
              'Criacao_bloqueio_URL',
            )
          } else {
            await logService.createLog(
              idAdmin,
              novaSuGestao.url,
              'Criacao_desbloqueio_URL',
            )
          }

          //console.log("Sugestão aceita: Indexação e arquivo bloqueados atualizados com sucesso.");
        } catch (error) {
          console.error("Erro ao processar indexação:", error);
          // Não propaga o erro para não afetar a atualização da sugestão
        }
      } else if (novaSuGestao.situacao === 'Recusado') {
        //console.log("Sugestão recusada: Nenhuma ação tomada na indexação nem no arquivo.");

        if(novaSuGestao.tipo === true){
          await logService.createLog(
            idAdmin,
            novaSuGestao.url,
            'Recusa_bloqueio_URL',
          )
        } else {
          await logService.createLog(
            idAdmin,
            novaSuGestao.url,
            'Recusa_desbloqueio_URL',
          )
        }
      }

      return novaSuGestao;

    

    }catch(error){
      //console.log(error)
      throw error;
    }
  
  }

  async getAll() {
    try{
      const sugestoes =await Sugestao.find().sort({ dataHora: -1 });
      // Map over suggestions to prepend base URL to foto field
      const sugestoesWithFullFotoUrl = sugestoes.map(sugestao => ({
        ...sugestao.toObject(), // Convert Mongoose document to plain object
        foto: sugestao.foto ? `http://192.168.12.1:4000/public/images/sugestoes/${sugestao.foto}` : ""
      }));
      return sugestoesWithFullFotoUrl;
    } catch(error){
      //console.log(error)
    }
  }

async getOne(id) {
  try {
    const sugestao = await Sugestao.findById(id).lean(); // .lean() para retornar um objeto simples
    const user = await User.findById(sugestao.idUser).lean();
    const indexacaoRelacionada = await indexacaoService.lookupIndexacao(sugestao.url);
    const frasesSugestao = this.normalizeFrasesPayload(sugestao.frases || []);
    const frasesIndexacao = this.normalizeFrasesPayload(indexacaoRelacionada?.frases || []);
    const frasesResolvidas = frasesSugestao.length > 0 ? frasesSugestao : frasesIndexacao;

    const fullFotoUrl = sugestao.foto ? `http://192.168.12.1:4000/public/images/sugestoes/${sugestao.foto}` : "";

    return {
      ...sugestao,
      nome: user.nome,
      email: user.email,
      foto: fullFotoUrl, // Return the full URL
      frasesResolvidas,
      indexacaoRelacionadaId: indexacaoRelacionada?._id || null,
    };
  } catch (error) {
    //console.log(error);
  }
}


  async update(id, payload, idAdmin) {
    try {
      const sugestaoAntiga = await Sugestao.findById(id);
      if (!sugestaoAntiga) {
        throw new Error("Sugestão não encontrada");
      }

    const updateData = {
      ...(payload.idUser !== undefined && { idUser: payload.idUser }),
      ...(payload.url !== undefined && { url: payload.url }),
      ...(payload.motivo !== undefined && { motivo: payload.motivo }),
      ...(payload.tipo !== undefined && { tipo: payload.tipo }),
      ...(payload.situacao !== undefined && { situacao: payload.situacao }),
      ...(payload.foto !== undefined && { foto: payload.foto }),
    };

      const sugestaoAtualizada = await Sugestao.findByIdAndUpdate(
        id,
      updateData,
        { new: true }
      );

      if (!sugestaoAtualizada) {
        throw new Error("Erro ao atualizar sugestão");
      }

      // Se a situação foi alterada para Aceito
      if (sugestaoAtualizada.situacao === 'Aceito') {
        try {
          // Tenta encontrar uma indexação existente
          const indexacaoExistente = await indexacaoService.lookupIndexacao(sugestaoAtualizada.url);
          const frasesSelecionadas = this.normalizeFrasesPayload(payload.frasesSelecionadas || []);
          
          let frasesAtualizadas = [];
          if (indexacaoExistente) {
            const frasesBase = this.normalizeFrasesPayload(indexacaoExistente.frases || []);
            const frasesMap = new Map(frasesBase.map((item) => [item.texto, { ...item }]));

            for (const frase of frasesSelecionadas) {
              const atual = frasesMap.get(frase.texto);
              frasesMap.set(frase.texto, {
                texto: frase.texto,
                ofensiva: sugestaoAtualizada.tipo ? true : false,
                ...(atual ? {} : {}),
              });
            }

            frasesAtualizadas = Array.from(frasesMap.values());
            const novaFlag = frasesAtualizadas.some((item) => item.ofensiva);

            await Indexacao.updateMany(
              { urlWeb: indexacaoExistente.urlWeb },
              {
                $set: {
                  flag: novaFlag,
                  frases: frasesAtualizadas,
                  motivo: sugestaoAtualizada.motivo || indexacaoExistente.motivo,
                },
              }
            );
          } else {
            frasesAtualizadas = frasesSelecionadas.map((item) => ({
              texto: item.texto,
              ofensiva: sugestaoAtualizada.tipo ? true : false,
            }));
            await indexacaoService.createBlock({
              url: sugestaoAtualizada.url,
              motivo: sugestaoAtualizada.motivo,
              frases: frasesAtualizadas,
              tipoInsercao: "Manual",
              flag: frasesAtualizadas.some((item) => item.ofensiva),
              urlWeb: sugestaoAtualizada.url
            });
          }

          if(sugestaoAtualizada.tipo === true){
            await logService.createLog(
              idAdmin,
              sugestaoAtualizada.url,
              'Aprovacao_bloqueio_URL',
            )
          } else {
            await logService.createLog(
              idAdmin,
              sugestaoAtualizada.url,
              'Aprovacao_desbloqueio_URL',
            )
          }

          //console.log("Sugestão aceita: Indexação e arquivo bloqueados atualizados com sucesso.");
        } catch (error) {
          console.error("Erro ao processar indexação:", error);
          // Não propaga o erro para não afetar a atualização da sugestão
        }
      } else if (sugestaoAtualizada.situacao === 'Recusado') {
        //console.log("Sugestão recusada: Nenhuma ação tomada na indexação nem no arquivo.");

        if(sugestaoAtualizada.tipo === true){
          await logService.createLog(
            idAdmin,
            sugestaoAtualizada.url,
            'Recusa_bloqueio_URL',
          )
        } else {
          await logService.createLog(
            idAdmin,
            sugestaoAtualizada.url,
            'Recusa_desbloqueio_URL',
          )
        }
      }

      return sugestaoAtualizada;
    } catch (error) {
      console.error("Erro ao atualizar sugestão:", error);
      throw error;
    }
  }
}

export default new SugestaoService();
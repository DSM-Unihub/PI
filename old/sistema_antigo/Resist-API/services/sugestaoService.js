import Sugestao from '../models/sugestao.js';
import User from '../models/user.js'
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
        situacao: data.situacao,
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


  async update(id,idUser,url,motivo,tipo,situacao,foto){
    try{
      const updateSituacao = await Sugestao.findByIdAndUpdate(id,{
        idUser,
        url,
        motivo,
        tipo,
        situacao,
        foto
      },
    {new: true});
    console.log(`Dados da Sugestao com o id: ${id} alterados com sucesso`);
    return updateSituacao;
    }catch(error){
      console.log(error)
    }
  }
}

export default new SugestaoService();
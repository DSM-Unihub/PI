import Funcionario from "../models/Funcionario.js";

class funcionarioService {
  
  async getOne(id) {
    try {
      const Funcionario = await Funcionario.findById(id);
      return Funcionario;
    } catch (error) {
      console.log(error);
    }
  }

  async getAll() {
    try {
      const Funcionarios = await Funcionario.find();
      return Funcionarios;
    } catch (error) {
      console.log(error);
    }
  }

  async Create(nome, emails, senha, telefones, foto) {
    try {
      const newFuncionario = new Funcionario({
        nome,
        emails,
        senha,
        telefones,
        foto,
      });
      await newFuncionario.save();
    } catch (error) {
      console.log(error);
    }
  }

  async Delete(id) {
    try {
      await Funcionario.findByIdAndDelete(id);
      console.log(`Funcionario com id ${id} foi Deletado`);
    } catch (error) {
      console.log(error);
    }
  }

  async Update(nome, emails, senha, telefones, foto) {
    try {
      await Funcionario.findByIdAndUpdate(id, {
        nome,
        emails,
        senha,
        telefones,
        foto,
      });
      console.log(`Dados do Funcionario com id ${id} alterados com sucesso!`);
    } catch (error) {
      console.log(error);
    }
  }

  
}

export default new funcionarioService()
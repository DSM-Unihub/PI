import Funcionarios from "../models/Funcionario.js";

class funcionarioService {
  async getAll() {
    try {
      const funcionarios = await Funcionarios.find();
      return funcionarios;
    } catch (error) {
      console.log(error);
    }
  }

  async Create(nome, emails, senha, telefones, foto) {
    try {
      const newFuncionario = new Funcionarios({
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
      await Funcionarios.findByIdAndDelete(id);
      console.log(`Funcionario com id ${id} foi Deletado`);
    } catch (error) {
      console.log(error);
    }
  }

  async Update(nome, emails, senha, telefones, foto) {
    try {
      await Funcionarios.findByIdAndUpdate(id, {
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
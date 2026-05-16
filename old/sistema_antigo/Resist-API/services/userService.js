import User from '../models/user.js';
import bcrypt from 'bcrypt';
import Sugestao from '../models/sugestao.js';

class UserService {
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.senha, 10);
    userData.senha = hashedPassword;

    const user = new User(userData);
    return await user.save();
  }

  async getAllUsers() {
    return await User.find();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async getUserSugestions(id) {
    try {
      const usuario = await User.findById(id);
      if (!usuario) {
        throw new Error("Usuário não encontrado");
      }
      const sugestoes = await Sugestao.find({ idUser: usuario.id }).lean();
      return sugestoes;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao obter sugestões do usuário");
    }
  }

  
}

export default new UserService();
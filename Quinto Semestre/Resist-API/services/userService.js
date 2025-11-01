import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import Sugestao from '../models/sugestao.js';
import logService from './logService.js';

class UserService {
  async createUser(userData, actorId = null) {
    const hashedPassword = await bcrypt.hash(userData.senha, 10);
    userData.senha = hashedPassword;
    const user = new User(userData);

    const savedUser = await user.save();
    // Log de criação
    await logService.createLog(
      actorId || savedUser._id?.toString() || 'sistema',
      savedUser.id,
      'criacao_usuario',
    );
    return savedUser;
  }

  async getAllUsers() {
    return await User.find();
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async updateUser(id, updateData, actorId = null) {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (user) {
      await logService.createLog(
        actorId || id,
        user.id,
        'atualizacao_usuario',
      );
    }
    return user;
  }

  async deleteUser(id, actorId = null) {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      await logService.createLog(
        actorId || id,
        user.id,
        'delecao_usuario',
      );
    }
    return user;
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
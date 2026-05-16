import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

class AuthService {
  async login(email, senha) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      throw new Error('Senha inválida');
    }

    // Gerar um token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, permissoes: Number(user.permissoes || 0) },
      process.env.JWT_SECRET, // Armazene sua chave secreta no .env
      { expiresIn: '1h' }
    );

    return { user, token };
  }
}

export default new AuthService();

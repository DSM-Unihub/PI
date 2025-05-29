import authService from '../services/authService.js';

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const { user, token } = await authService.login(email, senha);

    res.status(200).json({ 
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        foto: user.foto,
        permissoes: user.permissoes,
      },
      token 
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export default {
  login,
};

import userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

const parseInstituicao = (body) => {
  if (body.instituicao && typeof body.instituicao === "object") {
    return body.instituicao;
  }

  return {
    nome: body.instituicao || "",
    cnpj: body.cnpj || "",
    conexao: body.conexao || "",
  };
};

const fotoUrl = (req, foto) => {
  if (!foto) return foto;
  if (/^https?:\/\//i.test(foto)) return foto;
  return `${req.protocol}://${req.get("host")}${foto.startsWith("/") ? foto : `/${foto}`}`;
};

const serializeUser = (req, user) => {
  const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  if (obj.senha !== undefined) delete obj.senha;
  return {
    ...obj,
    foto: fotoUrl(req, obj.foto),
  };
};

const createUser = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome) {
      return res.status(400).json({ success: false, message: "Nome é obrigatório" });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: "Email é obrigatório" });
    }

    if (!senha) {
      return res.status(400).json({ success: false, message: "Senha é obrigatória" });
    }

    // Desejo de permissões enviado no body.
    let desiredPerm = req.body.permissoes !== undefined ? Number(req.body.permissoes) : 0;
    if (Number.isNaN(desiredPerm)) desiredPerm = 0;

    // Tenta extrair o token. Se não houver, é criação pública.
    let creatorLevel = null;
    let creatorId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        creatorLevel = Number(decoded.permissoes ?? 0);
        creatorId = decoded.id || decoded._id || null;
      } catch (e) {
        creatorLevel = null;
      }
    }

    // Só admin cadastra professores/admins; público e gestão cadastram usuário comum.
    if (creatorLevel === null || creatorLevel < 2) {
      desiredPerm = 0;
    } else {
      if (desiredPerm < 0) desiredPerm = 0;
      if (desiredPerm > 2) desiredPerm = 2;
    }

    const userData = {
      nome,
      email,
      senha,
      telefone,
      foto: req.file ? `/uploads/${req.file.filename}` : (req.body.foto || ""),
      instituicao: parseInstituicao(req.body),
      permissoes: desiredPerm,
    };

    const user = await userService.createUser(userData, creatorId);
    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      data: serializeUser(req, user),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Erro ao criar usuário",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers("-senha"); // Exclui a senha
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
    }
    res.status(200).json(users.map((user) => serializeUser(req, user)));
  } catch (error) {
    console.error(error); // Log para ajudar na depuração
    res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(serializeUser(req, user));
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserSugestions = async (req, res) => {
  const idUser = req.params.id;
  try {
    const sugestoes = await userService.getUserSugestions(idUser);
    res.status(200).json(sugestoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao obter sugestões do usuário" });
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserSugestions,
};

import userService from '../services/userService.js';
import jwt from 'jsonwebtoken';

  const  createUser= async (req, res) => {
    try {
      //Desejo de permissões enviado no body
      let desiredPerm = req.body.permissoes !== undefined ? Number(req.body.permissoes) : 0;
      if (Number.isNaN(desiredPerm)) alvoPerm = 0;

      //Tenta extrair o token. Se n houver, é criação pública.
      let creatorLevel = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try{
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          creatorLevel = Number(decoded.permissoes ?? 0);
        } catch(e){
          creatorLevel = null; //token inválido, ent vai ser tratado como público
        }
      }

      //Regrinha: só admin cadastra professores e admins, o aluno e o professor apenas cadastram alunos.
      if(creatorLevel === null || creatorLevel < 2){
        desiredPerm = 0;
      } else {
        if (desiredPerm < 0) desiredPerm = 0;
        if (desiredPerm > 2) desiredPerm = 2;
      }

      req.body.permissoes = desiredPerm;

      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  const getAllUsers = async (req, res) => {
    try {
      const users = await userService.getAllUsers("-senha"); // Exclui a senha
      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'Nenhum usuário encontrado.' });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error(error); // Log para ajudar na depuração
      res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
  };

  const  getUserById= async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  const  updateUser= async (req, res) => {
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
  }

  const  deleteUser= async (req, res) => {
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
  }

  const getUserSugestions = async (req,res)=>{

    const idUser = req.params.id
    try{
      const sugestoes = await userService.getUserSugestions(idUser)
      res.status(200).json(sugestoes)
    } catch(error){
      console.error(error)
      res.status(500).json({error: "Erro ao obter sugestões do usuário" })
    }
  }

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserSugestions
  };
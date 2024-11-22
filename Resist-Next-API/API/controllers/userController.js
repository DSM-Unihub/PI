import userService from '../services/userService.js';

  const  createUser= async (req, res) => {
    try {
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

export default {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
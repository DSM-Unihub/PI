import User from '../models/user.js';
import bcrypt from 'bcrypt';

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

  
}

export default new UserService();
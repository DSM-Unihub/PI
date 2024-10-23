import Funcionario from "../models/Funcionario.js"; // Importa o modelo Funcionario

class UserService {
    // Método para buscar um único usuário pelo e-mail
    async getOne(email) {
        // Validação do formato do e-mail
        if (!email || typeof email !== 'string') {
            throw new Error("Formato de e-mail inválido");
        }

        try {
            // Busca o usuário pelo e-mail
            const user = await Funcionario.findOne({ email });

            // Retorna o usuário encontrado ou null se não encontrado
            return user; 
        } catch (error) {
            console.error("Erro ao buscar usuário:", error); // Loga o erro no console
            throw new Error("Falha ao buscar usuário"); // Lança um erro mais descritivo
        }
    }
}

// Exporta uma instância única do UserService
export default new UserService();

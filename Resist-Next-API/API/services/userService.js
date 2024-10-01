import Funcionario from "../models/Funcionario.js"

class userService{
    async getOne(email){
        try{
            const user = await Funcionario.findOne({email: email})
            return user;
        }catch (error){
            console.log(error)
        }
    }
    
}

export default new userService()
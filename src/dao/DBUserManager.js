const userModel = require('./models/user.models')

class DBUserManager {

    async checkUser(email, password) {
        try {
            console.log(email, password)
            const findUser = await userModel.findOne({ email }).lean()

            if (!findUser) throw Error("Usuario no registrado")

            if (findUser.password !== password) throw Error("Contrasena incorrecta")
            
            delete findUser.password

            return findUser

        } catch (error) {
            throw Error(error)
        }  
    }

    async addUser(first_name, last_name, email, password) {
        try {   
            console.log(first_name, last_name, email, password)         
            if (!first_name.trim()){
                throw new Error('Ingresa un Nombre correcto')
            }
    
            if (!last_name.trim()){
                throw new Error('Ingresa un Apellido correcto')
            }
    
            if (!email.trim()){
                throw new Error('Ingresa un email')
            }
            
            if (!password.trim()) {
                throw new Error('Ingresa una contrasena')
            }
    
            const user = {
                first_name,
                last_name,
                email,
                password
            }

            let result = await userModel.create(user).then((res) => {
                return res
            }).catch((err) => {
                throw new Error(err)
            })
            return result
        } catch (error) {
            throw Error(error)
        }
    }

}

module.exports = DBUserManager
const messagesModel = require('./models/messages.model')

class DBMessagesManager {

    async getAllMessages() {
        try {
            const allMessages = await messagesModel.find({}).lean()
            return allMessages
        } catch (error) {
            throw Error(error)
        }
    }

    async addMessage(message, user){
        try {
            const messageAdd = await messagesModel.create({user: user, message: message})
            .then((res) => {
                return res 
            })
            .catch((error) => {
                throw Error(error)
            })

            return messageAdd
        } catch (error) {
            throw Error(error)
        }
    }
}

module.exports = DBMessagesManager
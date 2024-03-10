const { Router } = require("express")
const DBMessagesManager = require("../dao/DBMessagesManager");
const messages = new DBMessagesManager()


const router = Router()

router.get("/", (req, res) => {
    messages.getAllMessages().then(result => {
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
})

router.post("/", (req, res) => {
    const newMessage = req.body
    const io = req.app.get('io');

    messages.addMessage(newMessage.message, 
        newMessage.user
        )
        .then(result => {
            console.log(result)
            io.emit('message sent', result);
            return res.status(200).json(`Se subio correctamente el mensaje`);
        }).catch(err => {
            res.status(400).json(err.message)
        });
})

module.exports = router
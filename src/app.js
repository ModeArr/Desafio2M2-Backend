const express = require("express")
const handlebars = require("express-handlebars")
const path = require("path")
const productsRoutes = require("./routes/products.routes")
const cartsRoutes = require("./routes/carts.routes")
const viewRoutes = require("./routes/views.routes")
const messagesRoutes = require("./routes/messages.routes")
const sessionRoutes = require("./routes/sessions.routes")
const mongoose = require('mongoose')
const mongoStore = require("connect-mongo")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const initializePassport = require("./config/passport.config")
const passport = require("passport")

PORT = 8080
API_PREFIX = "api"
MONGO_URL = "mongodb+srv://Coder:u9TPQxlvOLPXpuKA@coder-backend.qtumzqc.mongodb.net/?retryWrites=true&w=majority"
SECRET_SESSION = "secretSessionPassword"

const app = express()

app.use(express.urlencoded({ extends: true }));
app.use(express.json()); 
app.use(express.static(__dirname + '/public'))
app.use(cookieParser());
app.use(
  session({
    store: mongoStore.create({
      mongoUrl: MONGO_URL,
      dbName: 'ecommerce',
      collectionName: 'sessions',
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 60 * 3600,
    }),
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);

mongoose.connect(MONGO_URL, {
    dbName: 'ecommerce',
  })
    .then((conn) => {
        console.log("CONNECTED TO MONGODB")
    })
    .catch((err) => {
        console.log("ERROR CONNECTING TO DB", err)
    })

const server = app.listen(PORT, () => {
    console.log("SERVER FUNCIONANDO")
})
const io = require('socket.io')(server);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine())
app.set("views", path.join(`${__dirname}/views`))
app.set("view engine", "handlebars")
app.set("io",  io)

app.use(`/${API_PREFIX}/products`, productsRoutes)
app.use(`/${API_PREFIX}/carts`, cartsRoutes)
app.use(`/${API_PREFIX}/messages`, messagesRoutes)
app.use(`/${API_PREFIX}/sessions`, sessionRoutes)
app.use('/', viewRoutes)
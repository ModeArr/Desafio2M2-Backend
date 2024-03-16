const { Router } = require("express")
const path = require("path");
const pathDB = path.join(`${__dirname}/../dao/products.json`)
const styles = path.join(`${__dirname}/../public/styles/styles.css`)
const DBProductManager = require("../dao/DBProductManager");
const products = new DBProductManager()
const DBMessagesManager = require("../dao/DBMessagesManager");
const messages = new DBMessagesManager()
const DBCartManager = require("../dao/DBCartManager");
const cart = new DBCartManager()
const { authMdw, loggedRedirect } = require("../middleware/auth.middleware");


const router = Router()

router.get('/', authMdw, (req, res) => {
    const { page = 1, limit = 5, sort } = req.query;

    let query = {}

    if (req.query.status){
        query = { status: req.query.status 
        }
    }

    if (req.query.category){
        query = { category: req.query.category.charAt(0).toUpperCase()
            + req.query.category.slice(1) }
    }

    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    products.getProducts(page, limit, sort, query, url).then(result => {
        res.render("index", {
            title: "Desafio 1 Modulo 2",
            products: result.payload,
            nextPage: result.nextLink,
            prevPage: result.prevLink,
            user: req.session.passport.user,
            style: "styles.css"
        })
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
})

router.get('/realtimeproducts', authMdw, (req, res) => {
    const { page = 1, limit = 5, sort } = req.query;

    let query = {}

    if (req.query.status){
        query = { status: req.query.status 
        }
    }

    if (req.query.category){
        query = { category: req.query.category.charAt(0).toUpperCase()
            + req.query.category.slice(1) }
    }

    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    products.getProducts(page, limit, sort, query, url).then(result => {
        res.render("realtimeproducts", {
            title: "Desafio 1 Modulo 2 - Productos en tiempo real",
            products: result.payload,
            nextPage: result.nextLink,
            prevPage: result.prevLink,
            user: req.session.passport.user
        })
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
})

router.get('/chat', (req, res) => {

    messages.getAllMessages().then(result => {
        res.render("chat", {
            title: "Desafio 1 Modulo 2 - Chat en tiempo real",
            messages: result
        })
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
})

router.get('/products', authMdw, (req, res) => {
    const { page = 1, limit = 5, sort } = req.query;

    let query = {}

    if (req.query.status){
        query = { status: req.query.status 
        }
    }

    if (req.query.category){
        query = { category: req.query.category.charAt(0).toUpperCase()
            + req.query.category.slice(1) }
    }

    const url = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    products.getProducts(page, limit, sort, query, url).then(result => {
        res.render("products", {
            title: "Desafio 1 Modulo 2",
            products: result.payload,
            nextPage: result.nextLink,
            prevPage: result.prevLink,
            user: req.session.passport.user,
            style: "styles.css"
        })
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
})

router.get('/carts/:cid', authMdw, (req, res) => {
    const idCart = req.params.cid

    cart.getCartProducts(idCart).then(result => {
        res.render("cart", {
            title: "Desafio 1 Modulo 2 - Carrito de Compras",
            product: result
        })
    }).catch(err => {
        console.log(err);
        res.status(400).json(err.message);
    });
})

router.get('/login', loggedRedirect, (req, res) => {
        res.render("login", {
            title: "Desafio 1 Modulo 2 - Login"
        })
})

router.get('/register', loggedRedirect, (req, res) => {
    res.render("register", {
        title: "Desafio 1 Modulo 2 - Register"
    })
})

module.exports = router
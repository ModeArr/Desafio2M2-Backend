const { Router } = require("express")
const path = require("path");
const pathDB = path.join(`${__dirname}/../dao/products.json`)
const ProductManager = require("../dao/ProductManager");
const DBProductManager = require("../dao/DBProductManager");
const products = new DBProductManager()
const url = require('url');


const router = Router()

router.get("/", (req, res) => {
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

        res.status(200).json({status: "success", ...result});
        
    }).catch(err => {
        console.log(err);
        res.status(400).json({status: "error", message: err.message});
    });
})

router.get("/:pid", (req, res) => {
    const id = req.params.pid
    products.getProductById(id).then(result => {
        return res.status(200).json(result);
    }).catch(err => {
        res.status(400).json(err.message)
    })
})

router.post("/", (req, res) => {
    const newProduct = req.body
    const io = req.app.get('io');

    products.addProduct(newProduct.title, 
        newProduct.description, 
        newProduct.price, 
        newProduct.thumbnail, 
        newProduct.code, 
        newProduct.stock,
        newProduct.category,
        newProduct.status
        )
        .then(result => {
            io.emit('product created', result);
            return res.status(200).json(`Se subio correctamente el articulo con id: ${result._id}`);
        }).catch(err => {
            res.status(400).json(err.message)
        });
})

router.put("/:pid", (req, res) => {
    const editData = req.body
    const id = req.params.pid

    products.updateProduct(id, editData.field, editData.edit)
        .then(result => {
            return res.status(200).json(result);
        }).catch(err => {
            res.status(400).json(err.message)
        });
})

router.delete("/:pid", (req, res) => {
    const id = req.params.pid
    const io = req.app.get('io')

    products.deleteProduct(id)
        .then(result => {
            io.emit('product deleted', id)
            return res.status(200).json(result)
        }).catch(err => {
            res.status(400).json(err.message)
        });
})

module.exports = router
const productsModel = require('./models/products.model')
const url = require('url');


class DBProductManager {

    async getProducts(page, limit, sort, query, url) {
        try {
            const options = {
                page,
                limit,
                customLabels: {
                    docs: 'payload'
                },
                lean: true
            }
            if (sort){
                options.sort = { price: sort }
            }

           return await productsModel.paginate(query, options)
           .then((res) => { 
            let prevPageLink, nextPageLink
            if (res.hasPrevPage){
                url.searchParams.set('page', res.prevPage)
                prevPageLink = url.href
            }
            
            if (res.hasNextPage){
                url.searchParams.set('page', res.nextPage)
                nextPageLink = url.href
            }

            return {
                payload: res.payload,
                totalPages: res.totalPages,
                prevPage: res.prevPage,
                nextPage: res.nextPage,
                page: res.page,
                hasPrevPage: res.hasPrevPage,
                hasNextPage: res.hasNextPage,
                prevLink: prevPageLink ??  null,
                nextLink: nextPageLink ??  null
                } 
           })
           .catch((err) => {
            throw new Error(err)
             })
        } catch (error) {
            throw Error(error)
        }  
    }

    async addProduct(title="", description="", price=0, thumbnail=[], code="", stock=0, category="", status) {
        try {            
            if (!title.trim()){
                throw new Error('Ingresa un titulo de producto correcto')
            }
    
            if (!description.trim()){
                throw new Error('Ingresa una descripcion de producto correcto')
            }
    
            if (price <= 0  || typeof price != 'number'){
                throw new Error('Ingresa un numero de precio correcto')
            }

            if (!thumbnail.length){
                throw new Error('Ingresa un thumbnail de producto correcto')
            }
    
            if (!code.trim()){
                throw new Error('Ingresa un codigo de producto correcto')
            }
    
           const codeDuplicated = await productsModel.findOne({
            code: code
           })
            if (codeDuplicated && Object.keys(codeDuplicated).length !== 0){
                throw new Error('El codigo esta duplicado')
            }
            
            if (stock <= 0 || typeof stock != 'number') {
                throw new Error('Ingresa un numero mayor a cero para el stock')
            }

            if (!category.trim()) {
                throw new Error('Ingresa una categoria correctamente')
            }
            
            if (!typeof variable == "boolean") {
                throw new Error('Ingresa un valor booleano correcto si esta disponible o no a status')
            }
    
            const producto = {
                title,
                description,
                price,
                thumbnail,
                stock,
                code,
                status,
                category
            }

            let result = await productsModel.create(producto).then((res) => {
                return res
            }).catch((err) => {
                throw new Error(err)
            })
            return result
        } catch (error) {
            throw Error(error)
        }
    }

    async getProductById(id) {
        try {
            const productID = await productsModel.find({_id: id})
            if (!productID) {
                throw new Error('Producto no encontrado')
            } else {
                return productID
            }
        } catch (error) {
            throw Error(error)
        }
    }
    async updateProduct(id, field, edit){
        try {
            switch (field){
                case "title":
                    if (!edit.trim()){
                        throw new Error('Ingresa un titulo de producto correcto')
                    } else {
                        break
                    }
                case "description":
                    if (!edit.trim()){
                        throw new Error('Ingresa una descripcion de producto correcto')
                    } else {
                        break
                    }
                case "price":
                    if (edit <= 0  || typeof edit != 'number'){
                        throw new Error('Ingresa un numero de precio correcto')
                    } else {
                        break
                    }
                case "thumbnail":
                    if (!edit.length){
                        throw new Error('Ingresa un thumbnail de producto correcto')
                    } else {
                        break
                    }
                case "code":
                    let codeDuplicated = await productsModel.findOne({
                        code: edit
                       })
                    if (!edit.trim()){
                        throw new Error('Ingresa un codigo de producto correcto')
                    } else if (codeDuplicated){
                        throw new Error('El codigo esta duplicado, intenta otro')
                    } else {
                        break
                    }
                case "stock":
                    if (edit <= 0 || typeof edit != 'number') {
                        throw new Error('Ingresa un numero mayor a cero para el stock')
                    } else {
                        break
                    }
                default:
                    throw new Error('Ingresa un campo a editar correcto')
            }
            const editProduct = await productsModel.findByIdAndUpdate(id,
            { [field]: edit },
            {new: true} )
            .then((res) => {
                return `Se edito el ${field} del producto con id ${id}`
            })
            .catch((error) =>{
                throw Error(error)
            })
            return editProduct
        } catch (error) {
            throw Error(error)
        }
    }

    async deleteProduct(id){
        try {
            const deletedProduct = productsModel.findByIdAndDelete(id)
            .then( (res) => {
                return `Se borro correctamente el producto con id: ${id}` 
            })
            .catch( (error) => {
                throw Error(error)
            })
            return deletedProduct
        } catch (error) {
            throw Error(error)
        }
        
    }

}

module.exports = DBProductManager
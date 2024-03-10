const mongoose = require("mongoose");

const collectionName = "carts";

const cartsSchema = new mongoose.Schema({
    products: [
      {
          product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true
          },
          quantity:{
              type: Number,
              required: true
          }
      },
  ],
 });

cartsSchema.pre('findOne', function () {
    this.populate('products.product')
})

const cartsModel = mongoose.model(collectionName, cartsSchema);
module.exports = cartsModel;
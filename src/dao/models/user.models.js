const mongoose = require("mongoose");

const collection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  role: { type: String, default: 'usuario' },
});

const userModel = mongoose.model(collection, userSchema);
module.exports = userModel;
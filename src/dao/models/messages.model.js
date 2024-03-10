const mongoose = require("mongoose");

const collectionName = "messages";

const messagesSchema = new mongoose.Schema({
  user: String,
  message: String,
});

const messagesModel = mongoose.model(collectionName, messagesSchema);
module.exports = messagesModel;
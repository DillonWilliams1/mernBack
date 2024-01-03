const mongoose = require('mongoose');

const menu4Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const SelectedMenu4Model = mongoose.model('profile4', menu4Schema);



module.exports = SelectedMenu4Model;
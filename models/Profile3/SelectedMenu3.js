const mongoose = require('mongoose');

const menu3Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const SelectedMenu3Model = mongoose.model('profile3', menu3Schema);



module.exports = SelectedMenu3Model;
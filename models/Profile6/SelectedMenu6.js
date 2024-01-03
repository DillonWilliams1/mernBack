const mongoose = require('mongoose');

const menu6Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const SelectedMenu6Model = mongoose.model('profile6', menu6Schema);



module.exports = SelectedMenu6Model;
const mongoose = require('mongoose');

const menu1Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const SelectedMenu1Model = mongoose.model('profile1', menu1Schema);



module.exports = SelectedMenu1Model;
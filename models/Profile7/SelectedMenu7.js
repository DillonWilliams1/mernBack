const mongoose = require('mongoose');

const menu7Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const SelectedMenu7Model = mongoose.model('profile7', menu7Schema);



module.exports = SelectedMenu7Model;
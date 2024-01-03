const mongoose = require('mongoose');

const menu5Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const SelectedMenu5Model = mongoose.model('profile5', menu5Schema);



module.exports = SelectedMenu5Model;
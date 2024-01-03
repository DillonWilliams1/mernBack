const mongoose = require('mongoose');

const menu2Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const SelectedMenu2Model = mongoose.model('profile2', menu2Schema);



module.exports = SelectedMenu2Model;
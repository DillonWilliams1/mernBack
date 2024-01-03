const mongoose = require('mongoose');

const profile4Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const Profile4Model = mongoose.model('profile4_menu', profile4Schema);



module.exports = Profile4Model;
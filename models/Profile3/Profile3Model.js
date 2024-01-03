const mongoose = require('mongoose');

const profile3Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const Profile3Model = mongoose.model('profile3_menu', profile3Schema);



module.exports = Profile3Model;
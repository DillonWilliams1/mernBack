const mongoose = require('mongoose');

const profile6Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const Profile6Model = mongoose.model('profile6_menu', profile6Schema);



module.exports = Profile6Model;
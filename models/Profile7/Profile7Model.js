const mongoose = require('mongoose');

const profile7Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const Profile7Model = mongoose.model('profile7_menu', profile7Schema);



module.exports = Profile7Model;
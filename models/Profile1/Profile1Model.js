const mongoose = require('mongoose');

const profile1Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const Profile1Model = mongoose.model('profile1_menu', profile1Schema);



module.exports = Profile1Model;
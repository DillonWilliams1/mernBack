const mongoose = require('mongoose');

const profile5Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const Profile5Model = mongoose.model('profile5_menu', profile5Schema);



module.exports = Profile5Model;
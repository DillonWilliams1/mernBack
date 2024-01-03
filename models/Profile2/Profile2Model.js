const mongoose = require('mongoose');

const profile2Schema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imgUrl: String
});

const Profile2Model = mongoose.model('profile2_menu', profile2Schema);



module.exports = Profile2Model;
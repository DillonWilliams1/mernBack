const mongoose = require('mongoose');

const order1Schema = new mongoose.Schema({
  name: String,
  CustomerName: String,
  price: Number,
  Quantity: Number,
  CustomerID: String,
  CustomerPhoneNo: String
});

const order1Model = mongoose.model('order1', order1Schema);



module.exports = order1Model;


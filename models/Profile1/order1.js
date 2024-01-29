const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{name: String,price: Number,quantity: Number,},],
  price: Number,
  name: String,
  phone: String, 
  id: String,
  token:String,    
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;




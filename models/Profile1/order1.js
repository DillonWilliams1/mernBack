const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ name: String, price: Number }],
  price: Number,
});
const Order = mongoose.model('Order', orderSchema);



module.exports = Order;

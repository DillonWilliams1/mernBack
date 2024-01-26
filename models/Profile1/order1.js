const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
    },
  ],
  price: Number,
  name: String,
  phone: String, // Adding 'phone' property assuming you want to include it
  id: String,    // Adding 'id' property assuming you want to include it
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order4',
      },
      timestamp: { type: Date, default: Date.now },
      // Add any additional fields you want to store for accepted order
      items: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
      price: Number,
      name: String,
      phone: String,
      id: String,
    });

const Orderhistory = mongoose.model('Orderhistory4', orderSchema);

module.exports = Orderhistory;
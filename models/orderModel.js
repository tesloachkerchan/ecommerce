const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  /*user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  */
  products: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
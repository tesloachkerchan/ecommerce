const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
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
  },
   status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'pending',
  },
  paypalOrderId: {
    type: String,
    defualt: 'null'
   }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
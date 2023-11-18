const express = require('express');
require('dotenv').config();
const router = express.Router();
const Order = require('../models/orderModel');
const paypal = require('@paypal/checkout-server-sdk');
const app = express()
app.use(express.json());

const Environment =
  process.env.NODE_ENV === 'production'
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalClient = new paypal.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  
  )
);

// Route to create a new order
router.post('/', async (req, res) => {
  try {
    // Calculate the total price
    let total = 0;
    req.body.items.forEach((item) => {
      total += item.price * item.quantity;
    });
    

    // Create a new order
    const order = new Order({
      // user: authenticated.user,
      products: req.body.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total,
      paymentMethod: 'paypal',
      paymentDate: new Date(),
    });

    // Save the order to the database
    const savedOrder = await order.save();

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD', // Assuming the currency is USD
            value: total.toFixed(2), // Assuming the total is a number representing the total price
          },
        },
      ],
    });

    const response = await paypalClient.execute(request);

    // Update the order with the PayPal order ID
    savedOrder.paypalOrderId = response.result.id;
    await savedOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create the order' });
  }
});

module.exports = router;
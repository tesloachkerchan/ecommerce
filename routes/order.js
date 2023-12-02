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
router.get('/', function (req, res, next) {
  const user = req.session.user || null;
   if (!user) {
    // Redirect the user to the home page or login page
    return res.redirect('/login?message=login again your session timeout'); // Replace '/' with the appropriate URL
  }

  const paypalClientId = process.env.PAYPAL_CLIENT_ID; // Get the PayPal client ID
  console.log(paypalClientId)
  res.render('payment', { paypalClientId: paypalClientId });
});

// Route to create a new order
router.post('/', async (req, res) => {
  try {
     const authenticatedUser = req.session.user;
    // Calculate the total price
    const items = req.body.items;
   
let total = 0;

for (const item of items) {
  const itemTotal = item.price * item.quantity;
  total += itemTotal;
}
    

    // Create a new order
    const order = new Order({
      user: {
    _id: authenticatedUser._id,
    name: authenticatedUser.name
  },
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
          currency_code: "USD",
          value: total,
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: total,
            },
          },
        },
        items: req.body.items.map(item => {
          return {
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: item.price,
            },
            quantity: item.quantity,
          }
        }),
      },
      ],
    });

    const response = await paypalClient.execute(request);
    console.log(response)

    // Update the order with the PayPal order ID
    savedOrder.paypalOrderId = response.result.id;
    await savedOrder.save();

    res.status(201).json(response.result.id);
  } catch (error) {
    console.log(error);
    //res.status(500).json({ error: 'Failed to create the order' });
  }
});


module.exports = router;
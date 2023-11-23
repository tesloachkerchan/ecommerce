var express = require('express');
const Order = require('../models/orderModel')
var router = express.Router();

/* GET thank you page. */
router.get('/', async function (req, res, next) {
  try {
      const user = req.session.user || null;
       if (!user) {
      // Redirect the user to the home page or login page
      return res.redirect('/'); // Replace '/' with the appropriate URL
    }

    // Fetch the most recent order from the database based on the authenticated user's ID
    const order = await Order.findOne({ 'user._id': user._id }).sort({ 
paymentDate:-1});

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Retrieve the order ID, total, and any other relevant data from the order object
    const orderId = order.paypalOrderId;
    const total = order.total;

    res.render('thank', { user: user, orderId: orderId, total: total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch the order' });
  }
});

module.exports = router;
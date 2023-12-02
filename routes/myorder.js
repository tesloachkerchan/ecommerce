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
       const perPage = 6;
    const page = parseInt(req.query.page) || 1;

    // Fetch the most recent order from the database based on the authenticated user's ID
    const orders = await Order.find({ 'user._id': user._id }).sort({ 
        paymentDate: -1
    }).skip((page - 1) * perPage)
      .limit(perPage);
     
    
    // Get the total count of products for pagination
    const totalCount = await Order.countDocuments({ 'user._id': user._id });

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalCount / perPage);

    // Render the 'product' view and pass the product data and pagination details
    

    if (!orders) {
      return res.status(404).json({ error: 'you do not have order' });
    }


    res.render('myorder', { orders, totalPages, currentPage: page });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch the order' });
  }
});

module.exports = router;
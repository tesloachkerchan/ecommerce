var express = require('express');
const Product = require('.././models/productModel');
var router = express.Router();
// GET route with pagination support
router.get('/', async (req, res, next) => {
  try {
    const perPage = 12; // Number of products per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const skip = (page - 1) * perPage;

    const searchQuery = req.query.search || ''; // Retrieve the search query from the request query parameters

    // Modify the product query to include the search functionality
    const products = await Product.find({
      name: { $regex: searchQuery, $options: 'i' }, // Case-insensitive search by product name
    })
      .skip(skip)
      .limit(perPage);

    const totalProducts = await Product.countDocuments({
      name: { $regex: searchQuery, $options: 'i' }, // Count only the matching products for pagination
    });
    const totalPages = Math.ceil(totalProducts / perPage);

    res.render('products', { products, totalPages, currentPage: page });
  } catch (error) {
    res.render('products', { error: 'Failed to fetch products', products: [], totalPages: 0, currentPage: 1 });
  }
});
// Create new products
router.post('/', async (req, res) => {
  try {
    const products = req.body;
    const createdProducts = await Product.create(products);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
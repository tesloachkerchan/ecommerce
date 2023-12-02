var express = require('express');
var router = express.Router();
let Product = require('../models/productModel')

/* GET home page. */
router.get('/', async function (req, res, next) {
  const user = req.session.user || null
 const products = await Product.find().sort({ _id: -1 }).limit(8);
  res.render('index', { user,products });
});

module.exports = router;

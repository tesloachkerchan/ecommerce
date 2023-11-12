var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const title = 'Products Page';
  res.render('products', { title });
});

module.exports = router;
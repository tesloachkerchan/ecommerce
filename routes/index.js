var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
   const user = req.session.user || null
  res.render('index', { user });
});

module.exports = router;

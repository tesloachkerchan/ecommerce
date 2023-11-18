var express = require('express');
var router = express.Router();
let userController = require('.././controllers/usersController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/',userController)

module.exports = router;

const express = require('express');
const router = express.Router();
const registration = require('../controllers/usersController');

// GET route for rendering the registration form
router.get('/', (req, res) => {
  res.render('register', { message: null, messageType: null });
});

// POST route for processing the registration form
router.post('/', registration);

module.exports = router;
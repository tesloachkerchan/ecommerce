const express = require('express');
const router = express.Router();
const login = require('../controllers/authentication');

// GET route for rendering the login form
router.get('/', (req, res) => {
  res.render('login', { message: null, messageType: null });
});

// POST route for processing the login form
router.post('/', login);

module.exports = router;
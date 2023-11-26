const bcrypt = require('bcryptjs');
const express = require('express');
const User = require('../models/userModel');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

const login = async (req, res) => {
  const { email, password } = req.body;
  const authenticated = await authenticateUser(email, password);

  if (authenticated.success) {
    req.session.user = authenticated.user; // Store the authenticated user in the session
    if (authenticated.user.role === 'admin') {
      res.redirect('/products');
    } else {
      res.redirect('/');
    }
  } else {
    res.render('login', {
      message: authenticated.message,
    });
  }
};

async function authenticateUser(email, password) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (!user.password) {
      return { success: false, message: 'Invalid password' };
    }
    if (typeof password !== 'string') {
      return { success: false, message: 'Invalid password format' };
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return { success: false, message: 'Incorrect password' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('An error occurred during authentication:', error);
    return { success: false, message: 'An error occurred during authentication' };
  }
}

module.exports = login;
// Import the necessary modules
const express = require('express');
const session = require('express-session');
require("dotenv").config()
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');
const loginRoute = require('./routes/login');
const orderRoute = require('./routes/order')
const logoutRoute = require('./routes/logout')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRoute);
app.use('/register', authRoute);
app.use('/login', loginRoute)
app.use('/create-order', orderRoute);
app.use('/logout',logoutRoute)

// Port
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected!');
   
  })
  .catch((err) => console.log(err));
   app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

module.exports = app;
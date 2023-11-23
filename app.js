// Import the necessary modules
const express = require('express');
const session = require('express-session');
require("dotenv").config()
const mongoose = require('mongoose');
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
const thankRoute = require('./routes/thank')
const profileRoute = require('./routes/profile')

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
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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
app.use('/capture-payment',orderRoute)
app.use('/logout', logoutRoute)
app.use('/payment', orderRoute)
app.use('/thank', thankRoute)
app.use('/profile', profileRoute)
app.use('/update-profile',profileRoute)

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
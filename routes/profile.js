const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/userModel');

// Set up multer storage for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

/* GET profile page. */
router.get('/', function (req, res, next) {
  const user = req.session.user || null;
  if (!user) {
    res.redirect('/');
  }
  res.render('profile', { user: user });
});

/* POST update profile */
router.post('/', upload.single('photo'), function (req, res, next) {
  const userId = req.session.user._id;

  // Handle profile picture update
  let photo = req.file ? req.file.path : null;
  if (!photo) {
    photo = req.session.user.photo;
  }

  // Update user information
  User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      photo: photo
    },
    { new: true }
  )
    .then(updatedUser => {
      res.json({ user: updatedUser });
    })
    .catch(error => {
      console.error(error);
      res
        .status(500)
        .json({ error: 'An error occurred while updating the profile.' });
    });
});

module.exports = router;
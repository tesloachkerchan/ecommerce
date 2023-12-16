const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path')
const User = require('../models/userModel')

const upload = multer({ dest: 'uploads/' });

/* GET profile page. */
router.get('/', function (req, res, next) {
  const user = req.session.user || null;
  if (!user) {
    res.redirect('/');
  }
  res.render('profile', { user: user });
});

router.post('/', upload.single('photo'), async function (req, res, next) {
  try {
    const file = req.file;
    const userId = req.session.user._id;

    const fileData = fs.readFileSync(file.path);
    const base64Data = fileData.toString('base64');

    const formData = new FormData();
    formData.append('image', base64Data);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      params: {
        key: 'dd0d75996ab0e89858bbe6e49f3d3f4b',
      },
    });

    const imageUrl = response.data.data.url;

     // Update user information
  User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      photo: imageUrl
    },
    { new: true }
  ).then(() => {
    res.redirect('profile')
  })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
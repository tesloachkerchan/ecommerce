const userModel = require('.././models/userModel');

const registration = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.render('register', { message: 'User with this email already exists', messageType: 'danger' });
  }

  // Create a new user
  const user = new userModel({ name, email, password });
  try {
    await user.save();
    res.redirect('/login'); // Redirect to login page

    // If you still want to show a success message, you can flash it to be displayed on the login page
    req.flash('success', 'User registered successfully');
  } catch (err) {
    console.error(err);
    res.render('register', { message: 'Error registering user', messageType: 'danger' });
  }
};

module.exports = registration;
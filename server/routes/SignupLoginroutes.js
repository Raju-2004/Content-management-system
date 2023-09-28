const express = require("express");
const router = express.Router();
const User = require('../models/UserModal');
const bcrypt = require('bcrypt')


router.post('/signup', async (req, res) => {
  try {
    const { fname, lname, Email, Password } = req.body;

    if (!fname || !lname || !Email || !Password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }


    const existingUser = await User.findOne({ email: Email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email address is already in use. Try to login' });
    }


    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    const user = new User({
      firstName: fname,
      lastName: lname,
      email: Email,
      password: hashedPassword, 
    });

    const savedUser = await user.save();
    console.log('User saved:', savedUser);
    
    req.session.user = savedUser;
    res.status(201).json(savedUser); 
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
});



router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ error: 'Email and password are required for login.' });
    }

    const user = await User.findOne({ email: Email });
    req.session.user = user;

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // At this point, the login is successful.
    // You can generate a JWT token here for authentication if needed.
    req.session.user = user;
    console.log("user logged");
    res.status(200).json({ message: 'Login successful', user: user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router
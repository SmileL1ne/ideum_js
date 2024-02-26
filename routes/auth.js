const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middlewares/auth'); 

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.redirect(`/error?message=${encodeURIComponent("Username already exists")}`);
    }

    const user = await User.create({ username, email, password });
    req.session.user = user;
    
    //res.status(201).json({ message: 'User registered successfully', user });
    res.status(201).redirect('/')
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/login', (req, res) => {
  res.render('login')
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    req.session.user = user;
    res.redirect('/')
    //res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/logout', isAuthenticated, async(req, res) =>{
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).send('Error');
    } else {
      res.redirect('/auth/login');
    }
  });
})

module.exports = router;
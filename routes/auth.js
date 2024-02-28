const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const isAuthenticated = require('../middlewares/auth'); 

router.get('/register', (req, res) => {
  const isAdmin = req.session.isAdmin;
  var isLoggedIn = (req.session.user || isAdmin) ? true : false;

  res.render('register', {isAdmin, isLoggedIn});
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).render('error', { errorCode: 400, error: 'Username already exists' });
    }

    const user = await User.create({ username, email, password });
    req.session.user = user;
    
    res.status(201).redirect('/')
  } catch (error) {
    res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
  }
});

router.get('/login', (req, res) => {
  const isAdmin = req.session.isAdmin;
  var isLoggedIn = (req.session.user || isAdmin) ? true : false;

  res.render('login', {isAdmin, isLoggedIn})
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).render('error', { errorCode: 404, error: 'User not found' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).render('error', { errorCode: 401, error: 'Invalid email or password' })
    }
    req.session.user = user;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      res.redirect('/admin');
      return
    }
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
  }
});

router.get('/logout', isAuthenticated, async(req, res) =>{
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    } else {
      res.redirect('/');
    }
  });
})

module.exports = router;
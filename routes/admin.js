const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

// Route to display all registered users
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const users = await User.find();
        res.render('admin_index', { users, isAdmin, isLoggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

// Route to delete a user
router.post('/delete/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).render('error', { errorCode: 404, error: 'User not found' });
        }

        await Post.deleteMany({ author: user });

        await user.deleteOne();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

// Route to view update user form
router.get('/update/:id', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        const isLoggedIn = (req.session.user || isAdmin) ? true : false;
        const user = await User.findById(req.params.id);

        res.render('user_update', { user, isAdmin, isLoggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

// Route to update user information
router.post('/update/:id', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).render('error', { errorCode: 404, error: 'User not found' });
        }

        user.username = username;
        user.email = email;
        await user.save();

        res.redirect('/admin/');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});


module.exports = router;

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
            return res.status(404).json({ error: 'User not found' });
        }
        await user.remove();
        res.json({ message: 'User deleted successfully' });
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
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username;
        user.email = email;
        await user.save();

        res.json({ message: 'User information updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});


module.exports = router;

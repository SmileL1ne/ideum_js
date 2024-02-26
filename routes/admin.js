const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route to display all registered users
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const users = await User.find();
        res.render('admin_index', { users, isAdmin, isLoggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// GET all posts
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const posts = await Post.find().populate('author');
        res.render('home', { posts, isLoggedIn, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;

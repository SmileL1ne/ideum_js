const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user'); 
const isAuthenticated = require('../middlewares/auth'); 

// Render the page to create a new post

router.use(isAuthenticated);

router.get('/create', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const users = await User.find(); 
        res.render('create_post', { users, isAdmin, isLoggedIn }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new post
router.post('/create', async (req, res) => {
    try {
        const { title, content} = req.body;
        const author = req.session.user;
        const newPost = await Post.create({ title, content, author });
        //res.json(req.body);
        res.redirect(`/post/${newPost._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View a specific post
router.get('/:postId', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const author = await User.findById(post.author);
        res.render('view_post', { post, author, isAdmin, isLoggedIn });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update a post
router.post('/update/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.redirect(`/post/${updatedPost._id}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a post
router.post('/delete/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.redirect('/')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

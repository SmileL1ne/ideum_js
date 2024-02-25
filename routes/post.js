const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Render the page to create a new post
router.get('/create', (req, res) => {
    res.render('create_post');
});

// Create a new post
router.post('/create', async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const newPost = await Post.create({ title, content, author });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a specific post
router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a post
router.put('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a post
router.delete('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

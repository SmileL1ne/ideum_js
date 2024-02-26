const express = require('express');
const router = express.Router();
const multer = require('multer');
const Post = require('../models/post');
const User = require('../models/user'); 
const isAuthenticated = require('../middlewares/auth'); 


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); 
    }
});
const upload = multer({ storage: storage });

router.use(isAuthenticated);

router.get('/create', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const users = await User.find(); 
        res.render('create_post', { users, isAdmin, isLoggedIn }); 
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

// Create a new post
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { title_en, title_ru, content_en, content_ru } = req.body;
        const author = req.session.user;
        const imageUrl = req.file.path;

        const newPost = new Post({
            title: { en: title_en, ru: title_ru }, 
            content: { en: content_en, ru: content_ru },
            author,
            imageUrl,
        });

        await newPost.save();

        res.redirect(`/post/${newPost._id}`);
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
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
            return res.status(404).render('error', { errorCode: 404, error: 'Post not found' });
        }

        const author = await User.findById(post.author);
        res.render('view_post', { post, author, isAdmin, isLoggedIn });
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});


// Update a post
router.post('/update/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });
        if (!updatedPost) {
            return res.status(404).render('error', { errorCode: 404, error: 'Post not found' });
        }
        res.redirect(`/post/${updatedPost._id}`);
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

// Delete a post
router.post('/delete/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).render('error', { errorCode: 404, error: 'Post not found' });
        }
        res.redirect('/')
    } catch (error) {
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Post = require('../models/post');
const isAuthenticated = require('../middlewares/auth'); 


router.get('/', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const posts = await Post.find().populate('author');
        res.render('home', { posts, isLoggedIn, isAdmin });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

router.get('/artists', async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const response = await axios.get('https://groupietrackers.herokuapp.com/api/artists');
        const artists = response.data;

        res.render('artists', { artists, isAdmin, isLoggedIn });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

router.get('/artist/:id', isAuthenticated, async (req, res) => {
    try {
        const isAdmin = req.session.isAdmin;
        var isLoggedIn = (req.session.user || isAdmin) ? true : false;

        const artistId = req.params.id;
        const response = await axios.get(`https://groupietrackers.herokuapp.com/api/artists/${artistId}`);
        const artistInfo = await axios.get(`https://groupietrackers.herokuapp.com/api/relation/${artistId}`);

        const artist = response.data;
        const datesLocations = artistInfo.data;

        res.render('artist', { artist, isAdmin, isLoggedIn, datesLocations });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorCode: 500, error: 'Internal Server Error' });
    }
});

module.exports = router;

const isAuthenticated = (req, res, next) => {
    if (req.session.user || req.session.isAdmin) {
        next();
    } else {
        res.redirect('/auth/login'); 
    }
};

module.exports = isAuthenticated;

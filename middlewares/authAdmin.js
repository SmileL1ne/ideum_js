const isAuthenticatedAsAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/auth/login'); 
    }
};

module.exports = isAuthenticatedAsAdmin;

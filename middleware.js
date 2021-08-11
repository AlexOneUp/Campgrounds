module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        // store url requested and redirect them after registered or login
        // console.log(req.path,req.originalUrl)
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
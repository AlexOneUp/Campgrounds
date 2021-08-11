const { campgroundSchema } = require('./validationSchemas');
const { reviewSchema } = require('./validationSchemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campgrounds');
const Review = require('./models/review');


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
// Validation Middleware to check if campground edits and posts are valid in the form Server-Side
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

}

/**
 *  This async function checks for 
 *  if a user trying to do some action is the AUTHOR of this campground
 */
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do this");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Validation Middleware to check if a review is valid in the form Server-Side
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Validation Middleware to check if a review's author is the author in the DB
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do this");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
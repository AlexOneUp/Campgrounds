const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const { validateReview } = require('../middleware');
const { isLoggedIn } = require('../middleware');
const { isReviewAuthor } = require('../middleware');

const reviewsController = require('../controllers/reviewsController');


router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;

const express = require('express'); 
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../validationSchemas');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campgrounds');

// Joi schema

// Validation Middleware to check if campground edits and posts are valid in the form Server-Side
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

}

/**
 * CRUD functionality for campgrounds
 */
// Diplay all camp grounds
router.get('/', catchAsync(async (req, res) => {
    // Find for all Campground models in our DB  
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// GET form to POST new Campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// Validate Middleware

// POST new Campground from new.ejs form data onto database : campgrounds
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

// Look up corresponding campground in database
// GET async function
router.get('/:id', catchAsync(async (req, res) => {
    // Find for all Campground models in our DB  
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// Serves the form to be able to EDIT campgrounds
router.get('/:id/edit', catchAsync(async (req, res) => {
    // Find for all Campground models in our DB  
    const campground = await Campground.findById(req.params.id);  
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

// Update using methodOverride to update campgrounds by ID
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);

}));


router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');

}));

module.exports = router;
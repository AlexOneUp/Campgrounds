const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroundsController = require('../controllers/campgroundsController');
// Joi schema


/**
 * CRUD functionality for campgrounds
 */
// Diplay all camp grounds
router.get('/', catchAsync(campgroundsController.index));

// GET form to POST new Campground
router.get('/new', isLoggedIn, campgroundsController.renderNewForm);

// Validate Middleware

// POST new Campground from new.ejs form data onto database : campgrounds
router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundsController.createCampground))

// Look up corresponding campground in database
// GET async function
router.get('/:id', catchAsync(campgroundsController.showCampground));

// Serves the form to be able to EDIT campgrounds
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsController.renderEditForm));

// Update using methodOverride to update campgrounds by ID
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground));


router.delete('/:id', isLoggedIn, catchAsync(campgroundsController.deleteCampground));

module.exports = router;
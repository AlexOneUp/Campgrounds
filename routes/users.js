const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const authController = require('../controllers/authController');

/**__________________________________________________________________________
 * NEW RESTRUCTURING PATTERN WITH router.route()
 * Look up express docs for this.
 * __________________________________________________________________________
 */
router.route('/register')
    .get(authController.renderRegister)
    .post(authController.register)
router.route('/login')
    .get(authController.renderLogin)
    .post(authController.login)
router.get('/logout', authController.logout);

module.exports = router;



/**__________________________________________________________________________
 * OLD WAY OF STRUCTURING ROUTES without router.route()
 * __________________________________________________________________________ 
 */

// router.get('/register', authController.renderRegister);

// router.post('/register', catchAsync(authController.register));

// router.get('/login', authController.renderLogin)

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), authController.login);

// router.get('/logout', authController.logout);
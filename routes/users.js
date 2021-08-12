const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const authController = require('../controllers/authController');

router.get('/register', authController.renderRegister);

router.post('/register', catchAsync(authController.register));

router.get('/login', authController.renderLogin)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), authController.login);

router.get('/logout', authController.logout);

module.exports = router;

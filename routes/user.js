const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController=require('../controllers/users');

router.route('/signup')
.get(userController.renderSignupForm) //Signup get route
.post(wrapAsync(userController.signup)); //Signup post route

router.route('/login')
.get(userController.renderLoginForm) //Login get route
.post(saveRedirectUrl, passport.authenticate('local', {  //Login post route
    failureRedirect: '/login', 
    failureFlash: true,
}), userController.login); 


router.get('/logout', (userController.logout));

module.exports = router;
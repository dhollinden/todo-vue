const express = require('express');
const router = express.Router();

// require controller module
const user_controller = require('../controllers/userController');


// ROUTES

// Signup user POST
router.post('/signup', user_controller.signup_post);

// Log In user POST
router.post('/login', user_controller.login_post);

// Log Out user GET
router.get('/logout', user_controller.logout_get);


module.exports = router;

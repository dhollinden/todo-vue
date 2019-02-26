const express = require('express');
const router = express.Router();

// require controller module
const user_controller = require('../controllers/userController');


// ROUTES

// Update email
//GET
router.get('/email', user_controller.account_email_get);
//POST
router.post('/email', user_controller.account_email_post);


// Update password POST
router.post('/password', user_controller.account_password_post);


// Delete account
// GET
router.get('/delete', user_controller.account_delete);


module.exports = router;

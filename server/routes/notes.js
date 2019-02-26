const express = require('express');
const router = express.Router();

// require controller module
const note_controller = require('../controllers/noteController');


// ROUTES

// Notes GET
router.get('/', note_controller.index);


// Create note POST
router.post('/create', note_controller.note_create_post);


// Update note POST
router.post('/:id/update', note_controller.note_update_post);


// Delete note POST
router.post('/:id/delete', note_controller.note_delete_post);


// Display note GET
router.get('/:id', note_controller.note_detail);


module.exports = router;


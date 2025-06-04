const express = require('express');
const router = express.Router();
const eventregController = require('../controllers/eventregController');

// GET registration form
router.get('/', eventregController.getEventRegistrationForm);

// POST registration data
router.post('/', eventregController.registerEvent);

module.exports = router;

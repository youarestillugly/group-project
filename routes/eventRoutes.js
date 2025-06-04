const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// List events page
router.get('/', eventController.getEventsPage);

// Event details page
router.get('/:id', eventController.getEventDetails);

// Edit event page
router.get('/:id/edit', eventController.getEditEventPage);
// Add this to your routes/events.js file, below existing routes
router.post('/:id/edit', eventController.updateEvent);


// View volunteers for event
router.get('/:id/volunteers', eventController.viewVolunteers);

// If you want to add POST routes later (for update, register volunteer), add here

module.exports = router;

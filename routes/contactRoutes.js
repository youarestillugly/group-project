// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.get('/', contactController.renderContactPage);
router.post('/submit', contactController.submitFeedback);

module.exports = router;

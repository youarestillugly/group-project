const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Define route for admin dashboard
router.get('/dashboard', adminController.getDashboard);

// Users routes
router.get('/users', adminController.getAllUsers);
router.post('/users/delete/:id', adminController.deleteUser);
// Feedback routes
router.get('/feedback', adminController.getFeedback);
router.post('/feedback/:id/delete', adminController.deleteFeedback);
router.post('/events/:id/approve', adminController.approveEvent);
router.post('/events/:id/reject', adminController.rejectEvent);
router.post('/events/:id/delete', adminController.deleteEvent);

module.exports = router;

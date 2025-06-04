const express = require('express');
 const router = express.Router();
 // Render the landing page
 router.get('/', (req, res) => {
 res.render('pages/index', { title: 'College Event Management System' });
 });
 module.exports = router;
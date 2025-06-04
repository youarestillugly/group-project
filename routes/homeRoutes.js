const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Middleware to ensure user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user && !req.session.user.isAdmin) {
    return next();
  }
  return res.redirect('/login');
}

// ✅ Use the controller, not direct render
router.get('/user/home', ensureAuthenticated, homeController.getLandingPage);

module.exports = router;

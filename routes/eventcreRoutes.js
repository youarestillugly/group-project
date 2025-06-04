const express = require('express');
const router = express.Router();
const eventcreController = require('../controllers/eventcreController');
const multer = require('multer');

// Set up Multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.get('/', eventcreController.getCreateEventPage);
router.post('/', upload.single('bannerImage'), eventcreController.createEvent);

module.exports = router;

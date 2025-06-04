const Event = require('../models/eventModel');

exports.getLandingPage = async (req, res) => {
  try {
    const events = await Event.findAll({ limit: 3 });

    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect('/login'); // Force login if no user in session
    }

    const studentName = `${req.session.user.firstName} ${req.session.user.lastName}`;

    res.render('user/home', { studentName, events });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading home page");
  }
};

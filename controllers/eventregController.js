const EventRegistration = require('../models/eventregModel');
const Event = require('../models/eventModel');

// Helper to get role from session safely
function getRoleFromSession(req) {
  if (req.session && req.session.user && req.session.user.role) {
    return req.session.user.role;
  }
  return 'guest';
}

// Show registration form (Only for student role)
exports.getEventRegistrationForm = async (req, res) => {
  try {
    const role = getRoleFromSession(req);

    if (role !== 'student') {
      return res.status(403).send('Access denied: Only students can register for events.');
    }

    const events = await Event.findAll({ where: { status: 'approved' } });

    const user = req.session.user;
    const fullName = `${user.firstName} ${user.lastName}`;
    const course = user.course;
    const email = user.email;

    res.render('user/eventreg', {
      events,
      role,
      activeTab: 'eventreg',
      fullName,
      course,
      email,
      successMessage: null
    });
  } catch (error) {
    console.error('Error loading registration form:', error);
    res.status(500).send('Server error');
  }
};

// Handle form submission
exports.registerEvent = async (req, res) => {
  try {
    const role = getRoleFromSession(req);

    if (role !== 'student') {
      return res.status(403).send('Access denied: Only students can submit event registration.');
    }

    const {
      fullName,
      gender,
      course,
      studentNumber,
      email,
      phone,
      eventName
    } = req.body;

    // Save registration
    await EventRegistration.create({
      fullName,
      gender,
      course,
      studentNumber,
      email,
      phone,
      eventName
    });

    // Re-fetch events and user details for re-render
    const events = await Event.findAll({ where: { status: 'approved' } });
    const user = req.session.user;

    res.render('user/eventreg', {
      events,
      role,
      activeTab: 'eventreg',
      fullName: `${user.firstName} ${user.lastName}`,
      course: user.course,
      email: user.email,
      successMessage: '✅ You have successfully registered for the event!'
    });
  } catch (err) {
    console.error('Error during event registration:', err);
    res.status(500).send('Registration Failed');
  }
};

const Event = require('../models/eventModel');

// Show event creation page
exports.getCreateEventPage = (req, res) => {
  const role = req.session.user?.role || 'guest';
  const success = req.query.success;

  res.render('user/eventcre', {
    role,
    activeTab: 'eventcre',
    success,
  });
};

// Handle event creation
exports.createEvent = async (req, res) => {
  try {
    const { title, date, time, location, organizer, participants, description } = req.body;
    const image = req.file ? req.file.filename : 'default.jpg'; // Use uploaded file or fallback

    await Event.create({
      title,
      date,
      time,
      location,
      organizer,
      participantsRequired: participants,
      description,
      image,
      status: 'pending', // Set default status for admin approval
    });

    // Redirect back to event creation page with success query
    res.redirect('/eventcre?success=1');
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).send('Internal Server Error');
  }
};

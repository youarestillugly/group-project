const { Op } = require('sequelize');
const Event = require('../models/eventModel');
const EventRegistration = require('../models/eventregModel');
// Render Events Page
exports.getEventsPage = async (req, res) => {
  try {
    const { search, category } = req.query;
    const where = {
      status: 'approved' // <-- Only show approved events
    };

    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    if (category) {
      where.category = category;
    }

    const all_events = await Event.findAll({
      where,
      order: [['date', 'ASC']]
    });

    const role = req.session.user?.role || 'guest';

    res.render('user/events', {
      all_events,
      role,
      activeTab: 'events'
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send('Internal Server Error');
  }
};
// Render Single Event Details Page
exports.getEventDetails = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).send('Event not found');
    }

    const role = req.session.user?.role || 'guest';

    res.render('user/eventDetails', {
      event,
      role,
      activeTab: 'events'
    });
  } catch (err) {
    console.error('Error fetching event details:', err);
    res.status(500).send('Internal Server Error');
  }
};
exports.getEditEventPage = async (req, res) => {
  try {
    const eventId = req.params.id;
    const eventInstance = await Event.findByPk(eventId);
    if (!eventInstance) return res.status(404).send('Event not found');

    // Convert Sequelize instance to plain object
    const event = eventInstance.get({ plain: true });

    // Ensure event.date is a JS Date object
    if (!(event.date instanceof Date)) {
      event.date = new Date(event.date);
    }

    const formattedDate = event.date.toISOString().slice(0, 16);

    res.render('user/editEventDetail', { event, formattedDate });
  } catch (err) {
    console.error('Error loading edit page:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.viewVolunteers = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).send('Event not found');

    // Match volunteers registered for this event
    const volunteers = await EventRegistration.findAll({
      where: { eventName: event.title }
    });

    res.render('user/viewVolunteer', {
      event,
      volunteers,
      role: req.session.user?.role || 'guest',
      activeTab: 'events'
    });
  } catch (err) {
    console.error('Error fetching volunteers:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Debug: check incoming body
    console.log('Received body:', req.body);

    if (!req.body) {
      return res.status(400).send('No form data submitted.');
    }

    const {
      title,
      date,
      location,
      participantsRequired,
      organizer,
      description
    } = req.body;

    // Find the event by primary key
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).send('Event not found');
    }

    // Update fields
    event.title = title || event.title;
    event.date = date || event.date;
    event.location = location || event.location;
    event.participantsRequired = parseInt(participantsRequired) || event.participantsRequired;
    event.organizer = organizer || event.organizer;
    event.description = description || event.description;

    // Handle file upload (optional, if using multer)
    // if (req.file) {
    //   event.image = req.file.filename;
    // }

    await event.save();

    res.redirect(`/events/${eventId}`);
  } catch (err) {
    console.error('Error updating event:', err.message);
    res.status(500).send('Internal Server Error');
  }
};
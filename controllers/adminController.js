const User = require('../models/User');
const Feedback = require('../models/feedbackModel');

const Event = require('../models/eventModel');

// ✅ This must be an async function
exports.getDashboard = async (req, res) => {
  try {
    const events = await Event.findAll(); // or filter by pending status
    res.render('admin/dashboard', { events });
  } catch (err) {
    console.error('Error loading admin dashboard:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.approveEvent = async (req, res) => {
  const eventId = req.params.id;
  await Event.update({ status: 'approved' }, { where: { id: eventId } });
  res.redirect('/admin/dashboard');
};

exports.rejectEvent = async (req, res) => {
  const eventId = req.params.id;
  await Event.update({ status: 'rejected' }, { where: { id: eventId } });
  res.redirect('/admin/dashboard');
};

exports.deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  await Event.destroy({ where: { id: eventId } });
  res.redirect('/admin/dashboard');
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('admin/user', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error loading users');
  }
};

// POST /admin/users/delete/:id
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.destroy({ where: { id: userId } });
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
};




exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.render('admin/feedback', { feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.render('admin/feedback', { feedbacks: [] });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    await Feedback.destroy({ where: { id: req.params.id } });
    res.redirect('/admin/feedback');
  } catch (err) {
    console.error('Error deleting feedback:', err);
    res.status(500).send('Server error');
  }
};

const Feedback = require('../models/feedbackModel');

exports.renderContactPage = (req, res) => {
  const success = req.query.success;

  // Get user info if logged in
  const user = req.session.user;
  const name = user ? `${user.firstName} ${user.lastName}` : '';
  const email = user ? user.email : '';

  res.render('user/contact', { success, name, email });
};

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Feedback.create({ name, email, message });
    res.redirect('/contact?success=1');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).send('Something went wrong. Please try again later.');
  }
};

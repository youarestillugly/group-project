const AboutModel = require('../models/aboutModel');

exports.getAboutPage = async (req, res) => {
  try {
    const teamMembers = await AboutModel.getTeamMembers();
    res.render('user/about', {
      title: 'About Us',
      teamMembers,
      studentName: req.session.studentName || 'Student',
    });
  } catch (err) {
    console.error('Error rendering about page:', err);
    res.status(500).send('Server Error');
  }
};

router.get('/participants', async (req, res) => {
  if (req.session.user.role !== 'organizer') {
    return res.status(403).send('Forbidden');
  }

  try {
    const participants = await Participant.findAll(); // adjust based on your model
    res.render('user/participants', {
      participants,
      role: req.session.user.role,
      activeTab: 'participants'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading participants');
  }
});

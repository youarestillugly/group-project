const teamMembers = [
  { name: 'Rinzin Dema', role: 'Backend Developer', image: 'rinzin.png' },
  { name: 'Rinchen Dorji', role: 'UIUX Designer', image: 'rinchen.png' },
  { name: 'Yeshi Choden', role: 'Frontend Developer', image: 'yeshey.png' },
  { name: 'Manita Gurung', role: 'Frontend Developer', image: 'manita.png' },
  { name: 'Pema Choden', role: 'Frontend Developer', image: 'pc.png' },
  { name: 'Pema Wangdi', role: 'Frontend Developer', image: 'pw.png' }
];

exports.getTeamMembers = async () => {
  return teamMembers;
};

// models/feedbackModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // adjust based on your path

const Feedback = sequelize.define('Feedback', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Feedback;

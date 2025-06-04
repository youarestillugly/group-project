// models/eventModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // adjust path as needed

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  organizer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  participantsRequired: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  image: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  }
}, {
  tableName: 'events',
  timestamps: true,
});

module.exports = Event;

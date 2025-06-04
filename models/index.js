const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Student = require('./student');
db.Event = require('./eventModel');
db.Event = require('./eventModel');  // no (sequelize, DataTypes)


module.exports = db;

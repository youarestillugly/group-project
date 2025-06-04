module.exports = (sequelize, DataTypes) => { 
  const Student = sequelize.define('Student', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  return Student;
};

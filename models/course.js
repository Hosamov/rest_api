'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {

  };
  Course.init({
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    }
  }, { sequelize });

  // create a PersonId:
  Course.associate = (models) => {
    // you have to keep the foreign key config in sync across the User and Course models...
    Course.belongsTo(models.User, {
      as: 'user', // alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    }); // tells Sequelize a user can be associated with one or more (or "many") courses
  };
  return Course;
};

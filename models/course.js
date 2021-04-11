'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Sequelize.Model {}
  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
      as: 'userPerson', // alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    }); // tells Sequelize a user can be associated with one or more (or "many") courses
  };
  return Course;
};

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
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required'
        },
        notEmpty: {
          msg: 'Please provide a title'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A course description is required'
        },
        notEmpty: {
          msg: 'Please provide a description'
        }
      }
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
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    }); // tells Sequelize a user can be associated with one or more (or "many") courses
  };
  return Course;
};

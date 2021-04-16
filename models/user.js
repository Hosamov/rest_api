'use strict';

const {Sequelize} = require('sequelize');
const bcrypt = require('bcryptjs'); //for encrypting the password

module.exports = (sequelize, DataTypes) => {
  class User extends Sequelize.Model {}
  User.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required'
        },
        notEmpty: {
          msg: 'Please provide a first name'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required'
        },
        notEmpty: {
          msg: 'Please provide a last name'
        }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email address you entered already exists'
      },
      validate: {
        notNull: {
          msg: 'An email address is required'
        },
        notEmpty: {
          msg: 'Email field cannot be empty'
        },
        isEmail: { //check if it's actually an email address.
          msg: 'Please provide a valid email address'
        }
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword); //set to hashed password before appending to db
      },
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        }
      }
    },
  }, { sequelize });

  // create a PersonId:
  User.associate = (models) => {
    // you have to keep the foreign key config in sync across the User and Course models...
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    }); // tells Sequelize a user can be associated with one or more (or "many") courses
  };
  return User;
};

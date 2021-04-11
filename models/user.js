'use strict';

const Sequelize = require('sequelize');
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
          msg: 'Please provide an email address'
        }
      }
    },
    unconfirmedPassword: {
      type: DataTypes.VIRTUAL, //virtual, for confirmation purposes. Does not save to db
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required'
        },
        notEmpty: {
          msg: 'Please provide a password'
        },
        len: { //set length constraints for the password
          args: [8, 20], //betwen 8 and 20 chars
          msg: 'The password should be between 8 and 20 characters in length'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if ( val === this.unconfirmedPassword ) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword); //set the hashed password in password column
        }
      },
      validate: { //check if it matches unconfirmedPassword
        notNull: {
          msg: 'Both passwords must match'
        }
      }
    }
  }, { sequelize });

  // create a PersonId:
  User.associate = (models) => {
    // you have to keep the foreign key config in sync across the User and Course models...
    User.hasMany(models.Course, {
      as: 'userPerson', // alias
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    }); // tells Sequelize a user can be associated with one or more (or "many") courses
  };
  return User;
};

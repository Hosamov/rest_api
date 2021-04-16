'use strict';

const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const { User, Course } = require('../models'); //import User & Course models from ../models
const bcrypt = require('bcryptjs'); // for hashing user passwords before saving them

//middleware:
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

/* /api/users GET route
// Returns the list of users
*/
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const user = req.currentUser; //check property currentUser on req body object
    if (user) {
      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
        // no password, createdAt, or updatedAt
      });
    }
  } catch (error) {
      res.status(400).json( { error } );
  }
}));

/* /api/users POST route
// Creates a new user
// redirects to '/'
*/
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);

    //return 201 status code, set location header to '/', return no content
    res.status(201).location('/').end();
  } catch (error) {
    console.log(error);
    //check SequelizeValidationError & SequelizeUniqueConstraintError
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json( { errors } ); //return validation or unique constraint errors w/ 400 status code
    } else {
      throw error;
    }
  }
}));

module.exports = router;

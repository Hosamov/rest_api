'use strict';

const auth = require('basic-auth');
const express = require('express');
const { User, Course } = require('../models'); //import User & Course models from ../models
const router = express.Router();
const { authenticateUser } = require('../middleware/auth-user');
const bcrypt = require('bcryptjs'); // for hashing user passwords before saving them

// Handler function to wrap each route.
const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      // Forward error to the global error handler
      next(error);
    }
  }
}

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser; //check property currentUser on req body object

  res.status(200).json({
    name: user.emailAddress,
    password: user.password
  });
}));

// Route that returns a list of courses
router.get('/courses',  asyncHandler(async (req, res) => {
  res.json('/api/courses GET route is working');
}));

// Route that returns a specific course
router.get('/courses/:id',  asyncHandler(async (req, res) => {
  res.json('/api/courses/:id GET route is working');
}));


// Route that creates a new user.
router.post('/users', async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    console.log(error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
});

// Route that creates a new user.
router.post('/courses', asyncHandler(async (req, res) => {
    res.json('/api/courses POST route is working!');
  // try {
  //   await User.create(req.body);
  //   res.status(201).json({ "message": "Account successfully created!" });
  // } catch (error) {
  //   if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
  //     const errors = error.errors.map(err => err.message);
  //     res.status(400).json({ errors });
  //   } else {
  //     throw error;
  //   }
  // }
}));

router.put('/courses/:id', asyncHandler(async (req, res) => {
  res.json('/api/courses/:id PUT route is working!');
}))

router.delete('/courses/:id', asyncHandler(async (req, res) => {
  res.json('/api/courses/:id DELETE route is working!');
}))

module.exports = router;

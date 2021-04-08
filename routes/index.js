'use strict';

const express = require('express');
const { User } = require('../models');
const router = express.Router();

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
router.get('/users',  async (req, res) => {
  res.json('The API is working...')

});

// Route that returns a list of courses
router.get('/courses',  async (req, res) => {
  res.json('The API is working...')

});

// Route that creates a new user.
router.post('/users', async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ "message": "Account successfully created!" });
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      throw error;
    }
  }
});

module.exports = router;

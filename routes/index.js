'use strict';

const auth = require('basic-auth');
const express = require('express');
const { User, Course } = require('../models'); //import User & Course models from ../models
const router = express.Router();
const bcrypt = require('bcryptjs'); // for hashing user passwords before saving them

//middleware:
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');


/* /api/users GET route
// Returns the list of users
*/
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser; //check property currentUser on req body object
  res.status(200).json({
    name: user.emailAddress,
    password: user.password
  });
}));

/* /api/courses GET route
// Returns a list of courses including the User that owns each course
*/
router.get('/courses', asyncHandler(async (req, res) => {
  let courses;
  try {;
    courses = await Course.findAll();
    console.log(courses);
    res.status(200).json({courses})
  } catch (error) {
    res.status(400).json( { error } );
  }
}));

/* /api/courses/:id GET route
// Returns a corresponding course along with the User that owns that course
*/
router.get('/courses/:id',  asyncHandler(async (req, res, next) => {
  //res.json('/api/courses/:id GET route is working');
  try {
    const course = await Course.findByPk(req.params.id);
    if(course !== null) {
      res.status(200).json( { course } );
    } else {
      next();
    }
  } catch (error) {
    res.status(404).json( { error: "Course Not Found" } );
  }
}));

/* /api/users POST route
// Creates a new user
// redirects to '/'
*/
router.post('/users', asyncHandler(async (req, res) => {
  try {
    await User.create(req.body);

    //return 201 status code, set location header to '/' route
    res.status(201).location('/').end();
  } catch (error) {
    console.log(error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json( { errors } );
    } else {
      throw error;
    }
  }
}));

/* /api/courses POST route
// Creates a new course
// Sets location header to URI for newly created course
*/
router.post('/courses', asyncHandler(async (req, res) => {
  let course;
  try {
    course = await Course.create(req.body); //create a new course using req.body object
    const courseId = course.id;

    //return 201 status code, set location header to newly created course
    res.status(201).location('/courses/' + courseId).end();
  } catch (error) {
    console.log(error);
  }
}));

/* /api/courses/:id PUT route
// Updates corresponding course along with the User that owns that course
*/
router.put('/courses/:id', asyncHandler(async (req, res) => {
  //res.json('/api/courses/:id PUT route is working!');
  let course = await Course.findByPk(req.params.id);
  if(course) {
    //update the course table with data received from req.body
    await course.update(req.body);
    res.status(204).end(); //return 204 status code and no content
  } else {
    res.status(404).json({message: "Course not found"});
  }
}))

/* /api/courses/:id DELETE route
// Deletes the corresponding course
*/
router.delete('/courses/:id', asyncHandler(async (req, res) => {
  let course = await Course.findByPk(req.params.id);
  if(course) {
    //delete the selected course
    await course.destroy();
    res.status(204).end(); //return 204 status code and no content
  } else {
    res.status(404).json({message: "Course not found"});
  }
}))

module.exports = router;

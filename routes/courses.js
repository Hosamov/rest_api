'use strict';

const express = require('express');
const router = express.Router();
const auth = require('basic-auth');
const { User, Course } = require('../models'); //import User & Course models from ../models

//middleware:
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

/* /api/courses GET route
// Returns a list of courses including the User that owns each course
*/
router.get('/courses', asyncHandler(async (req, res) => {
  let courses;
  courses = await Course.findAll({
    attributes: [
      "id",
      "title",
      "description",
      "estimatedTime",
      "materialsNeeded"
      // no createdAt & updatedAt
    ],
    include: [{
      model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "emailAddress"
        ]
      }
    ]
  });

  if (courses) {
    res.status(200).json( { courses } ); //return 200 status & course data
  } else {
    res.status(400).json( { message: "Courses not found" } );
  }

}));

/* /api/courses/:id GET route
// Returns a corresponding course along with the User that owns that course
*/
router.get('/courses/:id',  asyncHandler(async (req, res, next) => {
  const course = await Course.findAll({
    where: { id: req.params.id },
    attributes: [
      "id",
      "title",
      "description",
      "estimatedTime",
      "materialsNeeded"
      // no createdAt & updatedAt
    ],
    include: {
      model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "emailAddress"
        ]
    },
  });

  if(course) {
    res.status(200).json( { course } ); //return 200 status & course data
  } else {
    res.status(400).json( { message: "Course not found" } );
  }

}));

/* /api/courses POST route
// Creates a new course
// Sets location header to URI for newly created course
*/
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
  try {
    const user = req.currentUser.id; //id of the current user
    req.body.userId = user; //set the userId within the request to user var

    let course = await Course.create(req.body); //create a new course using req.body object
    const courseId = course.id;
    //return 201 status code, set location header to newly created course
    res.status(201).location('/courses/' + courseId).end();
  } catch (error) {
    //validation error formatting w/ 400 status code
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json( { errors } );
    } else {
      throw error;
    }
  }
}));

/* /api/courses/:id PUT route
// Updates corresponding course along with the User that owns that course
*/
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser.id;
  try {
    let course = await Course.findByPk(req.params.id);
    if(course) {
      //update the course table with data received from req.body
      if(course.userId === user) {
        await course.update(req.body);
        res.status(204).end(); //return 204 status code and no content
      } else {
        //if user not authorized, return 403 status code ( not authorized )
        res.status(403).json( { message: "Insufficient permissions" } );
      }
    } else {
      res.status(400).json( { message: "Course not found" } ); //if the requested course doesn't exist
    }
  } catch (error) {
    //validation error formatting w/ 400 status code
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json( { errors } );
    } else {
      throw error;
    }
  }
}))

/* /api/courses/:id DELETE route
// Deletes the corresponding course
*/
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser.id;

  let course = await Course.findByPk(req.params.id);
  if(course) {
    //delete the selected course
    if(course.userId === user) {
      await course.destroy();
      res.status(204).end(); //return 204 status code and no content
    } else {
      //if user not authorized, return 403 status code ( not authorized )
      res.status(403).json({message: "Insufficient permissions"});
    }
  } else {
    res.status(400).json( { message: "Course not found" } ); //if the requested course doesn't exist
  }

}))

module.exports = router;

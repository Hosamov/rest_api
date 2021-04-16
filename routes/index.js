'use strict';

const express = require('express');
const router = express.Router();

//middleware:
const { errorHandler } = require('../middleware/error-handler');

//custom error handler for 500 Server error
router.get('/error', (req, res, next) => { // '/error' route
  //send a 500 error
  const err = errorHandler(500, 'There appears to be a problem with the server.');
  next(err);
});

module.exports = router;

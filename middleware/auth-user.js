'use strict';

// Middleware to authenticate the request using Basic Authentication.

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

//middleware
exports.authenticateUser = async (req, res, next) => {
  let message; // message to display
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({ where: { emailAddress: credentials.name } }); //email will act as username
    if (user) {
       const authenticated = bcrypt
         .compareSync(credentials.pass, user.password); // bcrypt method to compare passwords (input credential, stored password)
      if (authenticated) { // if the passwords match
        console.log(`Authentication successful for username: ${user.emailAddress} `);
        // add property named currentUser to req obj and set to authenticated user
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.emailAddress}`;
    }
  } else {
    message = `Auth header not found`;
  }

  if (message) {
    console.warn(message); //display the message
    res.status(401).json({ message: 'Access Denied' }); //401 access denied
  } else {
    next();
  }
}

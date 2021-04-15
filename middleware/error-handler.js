'use strict';

/* Handle error creation and logging */
exports.errorHandler = (status, message) => {
  //Create a new error class object
  const err = new Error()
  err.message = message;
  err.status = status;

  //log out the error code, and stack to the console, including message
  console.log('Error status code: ' + err.status);
  console.log(err.stack);

  return err;
};

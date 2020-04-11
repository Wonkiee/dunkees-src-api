/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 02:30:03
 * @modify date 2020-04-12 02:30:03
 * @desc [User route - All the processes related to users will be handled through this route]
 */

var express = require('express');
var router = express.Router();

const constants = require('../app/utils/constants');
const userService = require('../app/services/userService');
const fieldValidator = require('../app/utils/fieldValidator');
const errorResponseHanlder = require('../app/utils/errorResponseHandler');

/**
 * Create a user
 */
router.post('/create', (req, res) => {

  return userService.createUser(req.body, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.send(constants.RESPONSE_CODES.SUCCESS);
  })
});

/**
 * Get user by email
 */
router.get('/get-user/:email', (req, res) => {

  const hasError = fieldValidator.emptyParamsValidation(req, res, 'email');
  if (hasError) {
    return hasError
  }

  return userService.retrieveUserByEmail({email: req.params.email}, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.send(constants.RESPONSE_CODES.SUCCESS);
  })
});

/**
 * Get user by phone
 */
router.get('/get-user/:phone', (req, res) => {

  const hasError = fieldValidator.emptyParamsValidation(req, res, 'phone');
  if (hasError) {
    return hasError
  }

  return userService.retrieveUserByPhoneNumber({phone: req.params.phone}, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.send(constants.RESPONSE_CODES.SUCCESS);
  })
});

/**
 * Update user details by email.
 */
router.patch('/update-user/', (req, res) => {

  return userService.updateUserDetailsByEmail(req.body, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.sendStatus(constants.RESPONSE_CODES.SUCCESS);
  })
});

/**
 * Update user email using exisiting email
 */
router.patch('/update-user-email/', (req, res) => {

  return userService.updateUserEmailByExisitingEmail(req.body, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.send(constants.RESPONSE_CODES.SUCCESS);
  })
});

/**
 * update user phone using email
 */
router.patch('/update-user-phone/', (req, res) => {

  return userService.updateUserPhoneByEmail(req.body, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.send(constants.RESPONSE_CODES.SUCCESS);
  })
});

/**
 * Delete a user by email
 */
router.delete('/delete-user/', (req, res) => {

  return userService.deleteUserByEmail(req.body, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.send(constants.RESPONSE_CODES.SUCCESS);
  })
});

module.exports = router;

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 02:30:03
 * @modify date 2020-04-12 02:30:03
 * @desc [User route - All the processes related to users will be handled through this route]
 */
const express = require('express');
const router = express.Router();

const constants = require('../app/utils/constants');
const userService = require('../app/services/userService');
const fieldValidator = require('../app/utils/fieldValidator');
const errorResponseHanlder = require('../app/utils/errorResponseHandler');

/**
 * Create a user
 */
router.post('/create', (req, res) => {

  return userService.createUser(req.body, (locErr, userCreateRes) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.json(userCreateRes);
  })
});

/**
 * Get user by email
 */
router.get('/get-user-via-email/:email', (req, res) => {

  const hasError = fieldValidator.emptyParamsValidation(req, res, 'email');
  if (hasError) {
    return hasError
  }

  return userService.retrieveUserByEmail({ email: req.params.email }, (locErr, json) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.json(json);
  })
});

/**
 * Get user by phone
 */
router.get('/get-user-via-phone/:phone', (req, res) => {

  const hasError = fieldValidator.emptyParamsValidation(req, res, 'phone');
  if (hasError) {
    return hasError
  }

  return userService.retrieveUserByPhoneNumber({ phoneNumber: req.params.phone }, (locErr, user) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.json(user);
  })
});

/**
 * Update user details by email.
 */
router.patch('/update-user/', (req, res) => {

  return userService.updateUserDetailsByEmail(req.body, (locErr, userUpdateByMailRes) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.json(userUpdateByMailRes);
  })
});

/**
 * Update user email using exisiting email
 */
router.patch('/update-user-email/', (req, res) => {

  return userService.updateUserEmailByExisitingEmail(req.body, (locErr, userEmailUpdateRes) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.json(userEmailUpdateRes);
  })
});

/**
 * update user phone using email
 */
router.patch('/update-user-phone/', (req, res) => {

  return userService.updateUserPhoneByEmail(req.body, (locErr, userPhoneUpdateRes) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.json(userPhoneUpdateRes);
  })
});

/**
 * Delete a user by email
 */
router.delete('/delete-user/', (req, res) => {

  return userService.deleteUserByEmail(req.body, (locErr, userDeleteRes) => {
    if (locErr) {
      return errorResponseHanlder.handleErrorResponse(res, locErr);
    }
    return res.json(userDeleteRes);
  })
});

module.exports = router;

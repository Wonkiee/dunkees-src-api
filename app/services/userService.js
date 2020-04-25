/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 21:04:17
 * @modify date 2020-04-11 21:04:17
 * @desc [User service which will call User Dao - This class deals with the User Collection data]
 */
const bcrypt = require('bcrypt');
const moment = require('moment');

const BaseService = require('./baseService');
const passwordResetService = require('./passwordResetService');
const constants = require('../utils/constants');
const userDao = require('../dao/userDao');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.SERVICES.USER);

class UserService extends BaseService {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Insert a new user to User collection.
     *
     * @param {reqBody} reqBody - Request body
     * @param {Function} callback - Callback function
     */
    createUser(reqBody, callback) {

        if (!reqBody) {
            logger.error('Failed to create the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }
        const userDetails = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email,
            phone: reqBody.phoneNumber,
            isActive: true
        }

        return this.retrieveUserByEmail(reqBody, (error, docs) => {

            if (error) {
                logger.error(`Error occurred in retrieving user by email when attempting to create user: ${JSON.stringify(error)}`);
                return callback(error);
            }

            if (docs === undefined || !docs) {
                return this.hashPassword(reqBody.password, (err, hashedPassword) => {
                    if (err) {
                        logger.error(`Error in hashing password: ${JSON.stringify(err)}`);
                        return callback(err);
                    }

                    userDetails.password = hashedPassword;
                    return userDao.createUser(userDetails, (locErr, docs) => {
                        if (locErr) {
                            logger.error(`Error in creating user: ${JSON.stringify(locErr)}`);
                            return callback(locErr);
                        }
                        logger.info('Successfully created the user');
                        return callback(null, docs);
                    });
                });
            }
            return callback({ code: constants.RESPONSE_CODES.ERROR.USER_EXISTS });
        });
    }

    /**
     * Retrieve a user by email.
     *
     * @param {reqDetails} reqDetails - Request details
     * @param {Function} callback - Callback function
     */
    retrieveUserByEmail(reqDetails, callback) {

        if (!reqDetails || !reqDetails.email) {
            logger.error('Failed to retrieve the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.UNAUTHORISED });
        }

        return userDao.retrieveUserByEmail(reqDetails.email, (err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving user by email: ${JSON.stringify(err)}`);
                return callback(err);
            }

            logger.info('Successfully retrieved the user');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve a user by phone number.
     *
     * @param {reqDetails} reqDetails - Request details
     * @param {Function} callback - Callback function
     */
    retrieveUserByPhoneNumber(reqDetails, callback) {

        if (!reqDetails || !reqDetails.phoneNumber) {
            logger.error('Failed to retrieve the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        return userDao.retrieveUserByPhoneNumber(reqDetails.phoneNumber, (err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving user by phone number: ${JSON.stringify(err)}`);
                return callback(err);
            }

            logger.info('Successfully retrieved the user');
            return callback(null, docs);
        });
    }

    /**
    * Find a user by email and update with provided values
    *
    * @param {reqBody} reqBody - Request body
    * @param {Function} callback - Callback function
    */
    updateUserDetailsByEmail(reqBody, callback) {

        if (!reqBody || !reqBody.email) {
            logger.error('Failed to update the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }
        const userDetails = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            phone: reqBody.phoneNumber,
        };

        return userDao.updateUserDetailsByEmail(reqBody.email, this.deleteNullValues(userDetails), (err, docs) => {
            if (err) {
                logger.error(`Failed to update the user details for user email: ${reqBody.email}`);
                return callback(err);
            }
            logger.info(`Successfully updated user details for the user email: ${reqBody.email}`);
            return callback(null, docs);
        });
    }

    /**
    * Find a user by email and update its email address
    *
    * @param {reqBody} reqBody - Request body
    * @param {Function} callback - Callback function
    */
    updateUserEmailByExisitingEmail(reqBody, callback) {

        if (!reqBody || !reqBody.existingEmail || !reqBody.newEmail) {
            logger.error('Failed to update the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        return userDao.updateUserEmailByExisitingEmail(reqBody.existingEmail, reqBody.newEmail, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the user details for user email: ${reqBody.newEmail}`);
                return callback(err);
            }
            logger.info(`Successfully updated user details for the user email: ${reqBody.newEmail}`);
            return callback(null, doc);
        });
    }

    /**
     * Update a user phone by email
     *
     * @param {reqBody} reqBody - Request body
     * @param {Function} callback - Callback function
     */
    updateUserPhoneByEmail(reqBody, callback) {

        if (!reqBody || !reqBody.email || !reqBody.phoneNumber) {
            logger.error('Failed to update the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        return userDao.updateUserPhoneByEmail(reqBody.email, reqBody.phoneNumber, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the user phone number for user email: ${reqBody.email}`);
                return callback(err);
            }
            logger.info(`Successfully updated user phone number for the user email: ${reqBody.email}`);
            return callback(null, doc);
        });
    }

    /**
     * Delete a user by email
     *
     * @param {reqBody} reqBody - Request body
     * @param {Function} callback - Callback function
     */
    deleteUserByEmail(reqBody, callback) {

        if (!reqBody || !reqBody.email) {
            logger.error('Failed to delete the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        return userDao.deleteUserByEmail(reqBody.email, (err, doc) => {
            if (err) {
                logger.error(`Failed to delete the user for user email: ${reqBody.email}`);
                return callback(err);
            }
            logger.info(`Successfully deleted for the user email: ${reqBody.email}`);
            return callback(null, doc);
        });
    }

    /**
    * Login a user
    *
    * @param {reqBody} reqBody - Request body
    * @param {Function} callback - Callback function
    */
    loginUser(reqBody, callback) {

        if (!reqBody || !reqBody.email || !reqBody.password) {
            logger.error('Failed to login the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }
        const email = reqBody.email;
        const password = reqBody.password;

        return this.retrieveUserByEmail(reqBody, (err, res) => {
            if (err) {
                logger.error(`Error occured while getting user info in login process for the email: ${email}`);
                return callback(err);
            }

            if (!res || !res.password) {
                logger.error(`No matched data found for the email: ${email}`);
                return callback({ code: constants.RESPONSE_CODES.ERROR.USER_NOT_FOUND });
            }
            return bcrypt.compare(password, res.password, (err, result) => {
                if (err) {
                    logger.error(`Error comparing hashed password with user entered password: ${err}`);
                    return callback(err);
                }
                if (!result) {
                    logger.error(`Passwords does not match for the email: ${email}`);
                    return callback({ code: constants.RESPONSE_CODES.ERROR.UNAUTHORISED });
                }
                return callback(null, result);
            });
        });
    }

    /**
    * Login a guest user
    *
    * @param {reqBody} reqBody - Request body
    * @param {Function} callback - Callback function
    */
    loginGuestUser(reqBody, callback) {

        if (!reqBody) {
            logger.error('Failed to login the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        if (reqBody.isGuest) {
            return callback(null, reqBody.isGuest);
        }
        return callback({ code: constants.RESPONSE_CODES.ERROR.UNAUTHORISED });
    }

    /**
    * Reset password
    *
    * @param {reqBody} reqBody - Request body
    * @param {Function} callback - Callback function
    */
    resetPassword(reqBody, callback) {

        if (this.isAnyFieldEmpty(reqBody)) {
            logger.error('Failed to login the user: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        const email = reqBody.email;
        const password = reqBody.newPassword;

        return passwordResetService.retrieveTokenDetailsByEmail(email, (err, docs) => {
            if (err) {
                logger.error(`Failed to retrieve token from db when resetting password for mail ${email}`);
                return callback(err);
            }

            if (!this.isPasswordResetTokenValid(docs)) {
                return callback({ code: constants.RESPONSE_CODES.ERROR.TOKEN_EXPIRED });
            }
            const isTokenMatch = (docs.token).toUpperCase() === (reqBody.token).toUpperCase();

            if (!isTokenMatch) {
                logger.error(`Failed to reset password.Tokens does not match for the mail: ${email}`);
                return callback({ code: constants.RESPONSE_CODES.ERROR.TOKEN_MISMATCH });
            }

            return this.hashPassword(password, (err, hashedPassword) => {
                if (err) {
                    logger.error(`Error in password hashing: ${JSON.stringify(err)}`);
                    return callback(err);
                }

                return userDao.updatePasswordByEmail(email, hashedPassword, (locErr, docs) => {
                    if (locErr) {
                        logger.error(`Error in updating password for the user: ${JSON.stringify(locErr)}`);
                        return callback(locErr);
                    }
                    logger.info(`Successfully updated the password for the user ${JSON.stringify(email)}`);
                    return callback(null, true);
                });
            });
        });
    }

    /**
    * Check for password reset function errors
    *
    * @param {Object} reqBody - Request body
    * @param {Function} callback - Callback function
    */
    isAnyFieldEmpty(reqBody) {

        if (!reqBody || !reqBody.email || !reqBody.token || !reqBody.newPassword) {
            return true;
        }
        return false;
    }

    /**
    * Hash a gicen password
    *
    * @param {String} password - Password
    * @param {Function} callback - Callback function
    */
    hashPassword(password, callback) {

        const saltRounds = 10;
        return bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                logger.error(`Error in generating the password salt: ${JSON.stringify(err)}`);
                return callback(err);
            }
            return bcrypt.hash(password, salt, (error, hashedPassword) => {
                if (error) {
                    logger.error(`Error in hashing the password: ${JSON.stringify(error)}`);
                    return callback(error);
                }
                return callback(null, hashedPassword);
            });
        });
    }

    /**
    * Delete null values from an object
    *
    * @param {Object} object - Object passed
    * @returns {Object}
    */
    deleteNullValues(object) {

        const tempObject = object;
        for (let key in tempObject) {
            if (!tempObject[key]) {
                delete tempObject[key];
            }
        }
        return tempObject;
    }

    /**
    * Validate password reset token
    *
    * @param {Object} docs - Object retured from password reset collection
    * @returns {Boolean}
    */
    isPasswordResetTokenValid(docs) {

        const timeDiff = moment().diff(moment(docs.updated_at), 'hours');

        if (timeDiff > constants.PASSWORD_RESET.EXPIRATION_HOURS) {
            return false;
        }
        return true;
    }
}

module.exports = new UserService();

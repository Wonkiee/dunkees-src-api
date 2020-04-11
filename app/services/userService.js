/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 21:04:17
 * @modify date 2020-04-11 21:04:17
 * @desc [User service which will call User Dao - This class deals with the User Collection data]
 */
const BaseService = require('./baseService');
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
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
        }
        const userDetails = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email,
            password: reqBody.password,
            phone: reqBody.phoneNumber,
            isActive: true
        }
        return userDao.createUser(userDetails, (err, docs) => {
            if (err) {
                logger.error(`Error in creating user: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully created the user');
            return callback(null, docs);
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
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
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
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
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
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
        }
        const userDetails = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            phone: reqBody.phoneNumber,
        };

        return userDao.updateUserDetailsByEmail(reqBody.email, userDetails, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the user details for user email: ${reqBody.email}`);
                return callback(err);
            }
            logger.info(`Successfully updated user details for the user email: ${reqBody.email}`);
            return callback(null, doc);
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
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
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
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
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
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
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
        if (!reqBody || !reqBody.email || !reqBody.password) { console.log('her');
            logger.error('Failed to login the user: required fields are empty');
            return callback({code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING});
        }
        const email = reqBody.email;
        const password = reqBody.password;

        return this.retrieveUserByEmail(reqBody, (err, res) => {
            if (err) {
                logger.error(`Error occured while getting user info in login process for the email: ${email}`);
                return callback(err);
            }
            if (!res || !res.password || res.password !== password) {
                return callback({code: constants.RESPONSE_CODES.ERROR.INCORRECT_CREDENTIALS});
            }
            return callback(null, res);
        });
    }
}

module.exports = new UserService();

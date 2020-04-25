/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 19:25:34
 * @modify date 2020-04-11 19:25:34
 * @desc [User Dao]
 */

const constants = require('../utils/constants');
const userModel = require('../dao/models/userModel');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.DAO.USER);

class UserDao {

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Insert a new user to User collection.
     *
     * @param {userDetails} userDetails - User details object
     * @param {Function} callback - Callback function
     */
    createUser(userDetails, callback) {

        return userModel.create(userDetails, (err, docs) => {
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
     * @param {String} email - Email address of the user
     * @param {Function} callback - Callback function
     */
    retrieveUserByEmail(email, callback) {

        return userModel.findOne({
            email: email
        }).exec((err, docs) => {
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
     * @param {String} phoneNumber - Phone number of the user
     * @param {Function} callback - Callback function
     */
    retrieveUserByPhoneNumber(phoneNumber, callback) {

        return userModel.findOne({
            phone: phoneNumber
        }).exec((err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving user by phone number: ${JSON.stringify(err)}`);
                return callback(err);
            }

            if (!docs) {
                logger.error('Record not found');
                return callback({
                    code: constants.RESPONSE_CODES.ERROR.RECORD_NOT_FOUND
                });
            }

            logger.info('Successfully retrieved the user');
            return callback(null, docs);
        });
    }

    /**
    * Find a user by email and update with provided values
    *
    * @param {String} email - Email address of the user
    * @param {Object} userDetails - Object with new values to be updated
    * @param {Function} callback - Callback function
    */
    updateUserDetailsByEmail(email, userDetails, callback) {

        return userModel.findOneAndUpdate({
            email: email
        }, userDetails, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the user details for user email: ${email} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully updated user details for the user email: ${email}`);
            return callback(null, doc);
        });
    }

    /**
    * Find a user by email and update its email address
    *
    * @param {String} existingEmail - Existing email of the user
    * @param {String} newEmail - Newly entered email of the user
    * @param {Function} callback - Callback function
    */
    updateUserEmailByExisitingEmail(existingEmail, newEmail, callback) {

        return userModel.findOneAndUpdate({ email: existingEmail }, { email: newEmail }, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the user details for user email: ${newEmail} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully updated user details for the user email: ${newEmail}`);
            return callback(null, doc);
        });
    }

    /**
     * Update a user phone by email
     *
     * @param {String} email - User email
     * @param {String} phone - Phone number of the user
     * @param {Function} callback - Callback function
     */
    updateUserPhoneByEmail(email, phoneNumber, callback) {

        return userModel.findOneAndUpdate({ email: email }, { phone: phoneNumber }, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the user phone number for user email: ${email} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully updated user phone number for the user email: ${email}`);
            return callback(null, doc);
        });
    }

    /**
     * Delete a user by email
     *
     * @param {String} email - User email
     * @param {Function} callback - Callback function
     */
    deleteUserByEmail(email, callback) {

        return userModel.deleteOne({
            email: email
        }, (err, doc) => {
            if (err) {
                logger.error(`Failed to delete the user for user email: ${email} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully deleted for the user email: ${email}`);
            return callback(null, doc);
        });
    }

    /**
     * Update a user password by email
     *
     * @param {String} email - User email
     * @param {String} password - Password of the user
     * @param {Function} callback - Callback function
     */
    updatePasswordByEmail(email, password, callback) {

        return userModel.findOneAndUpdate({ email: email }, { password: password }, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the user password for user email: ${email} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully updated user password for the user email: ${email}`);
            return callback(null, doc);
        });
    }
}

module.exports = new UserDao();

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 23:06:49
 * @modify date 2020-04-12 23:06:49
 * @desc [PasswordResetService]
 */

const BaseService = require('./baseService');
const communicatorService = require('./communicatorService');
const constants = require('../utils/constants');
const passwordResetDao = require('../dao/passwordResetDao');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.SERVICES.PASSWORD_RESET);
const utilFunctions = require('../utils/functions');

class PasswordResetService extends BaseService {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Create or update token details with email
     *
     * @param {userDetails} userDetails - User details object
     * @param {Function} callback - Callback function
     */
    upsertTokenWithEmail(userDetails, callback) {

        if (!userDetails || !userDetails.email || !userDetails.token) {
            logger.error('Failed to update the token using email: required fields are empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        return passwordResetDao.upsertTokenWithEmail(userDetails, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the token details: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully updated token details');
            return callback(null, doc);
        });
    }

    /**
     * Retrieve token details by email.
     *
     * @param {String} email - Email address of the user
     * @param {Function} callback - Callback function
     */
    retrieveTokenDetailsByEmail(email, callback) {

        if (!email) {
            logger.error('Failed to retrieve the token using email: email field is empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        return passwordResetDao.retrieveTokenDetailsByEmail(email, (err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving token details by email: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully retrieved the user');
            return callback(null, docs);
        });
    }

    /**
     * Delete token details by email
     *
     * @param {String} email - User email
     * @param {Function} callback - Callback function
     */
    deleteTokenDetailsByEmail(email, callback) {

        if (!email) {
            logger.error('Failed to delete the token using email: email field is empty');
            return callback({ code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING });
        }

        return passwordResetDao.deleteTokenDetailsByEmail(email, (err, doc) => {
            if (err) {
                logger.error(`Failed to delete the token details for user email: ${email}`);
                return callback(err);
            }
            logger.info(`Successfully deleted the token details for user email: ${email}`);
            return callback(null, doc);
        });
    }

    /**
    * Send password reset mail
    *
    * @param {reqBody} reqBody - Request body
    * @param {Function} callback - Callback function
    */
    sendResetPasswordMail(reqBody, callback) {

        const token = utilFunctions.generateCustomToken();
        const emailDetails = {
            emailBody: token + " rajitha",
            emailTo: 'rajithabrajasooriya@gmail.com',
            subject: 'Hi'
        }

        return communicatorService.sendMail(emailDetails, (err) => {
            if (err) {
                logger.error(`Failed to send the mail when resetting the password, Mail Body: ${JSON.stringify(emailDetails)}`);
                return callback(err);
            }

            return this.upsertTokenWithEmail({
                token: token,
                email: reqBody.email
            }, (err, res) => {
                if (err) {
                    logger.error(`Error in updating password reset token in db: ${JSON.stringify(err)}`);
                    return callback(err);
                }
                logger.info('Successfuly updated the token details in db');
                return callback(null, res._id);
            });
        });

    }
}

module.exports = new PasswordResetService();

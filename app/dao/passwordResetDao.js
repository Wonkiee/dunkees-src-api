/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 22:49:20
 * @modify date 2020-04-12 22:49:20
 * @desc [Password Reset Dao]
 */


const constants = require('../utils/constants');
const passwordResetModel = require('../dao/models/passwordReset');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.MODELS.PASSWORD_RESET);

class PasswordReset {

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Create or update token details with email
     *
     * @param {userDetails} userDetails - User details object
     * @param {Function} callback - Callback function
     */
    upsertTokenWithEmail(userDetails, callback) {

        return passwordResetModel.findOneAndUpdate({ email: userDetails.email }, { token: userDetails.token }, { upsert: true }, (err, doc) => {
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

        return passwordResetModel.findOne({
            'email': email
        }).exec((err, docs) => {
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

        return passwordResetModel.deleteOne({
            email: email
        }, (err, doc) => {
            if (err) {
                logger.error(`Failed to delete the token details for user email: ${email}`);
                return callback(err);
            }
            logger.info(`Successfully deleted the token details for user email: ${email}`);
            return callback(null, doc);
        });
    }
}

module.exports = new PasswordReset();

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 23:07:34
 * @modify date 2020-04-11 23:07:34
 * @desc [Communicatot Service- Does all the communication with outer world]
 */

const nodemailer = require("nodemailer");

const BaseService = require('./baseService');
const config = require('../configurations');
const constants = require('../utils/constants');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.COMMUNICATOR_SERVICE);

class CommunicationService extends BaseService {

    constructor() {
        super();
    }

    /**
    * Send emails
    * @param {Object} emailDetails - Details regarding the email to be sent
    * @param {String} emailDetails.emailBody - Email body
    * @param {String} emailDetails.emailTo - Reciever's email
    */
    async sendMail(emailDetails, callback) {

        try {
            const transporter = nodemailer.createTransport({
                service: config.communicator.email.service,
                auth: {
                    user: config.communicator.email.email_account,
                    pass: config.communicator.email.app_password,
                }
            });

            const info = await transporter.sendMail({
                from: config.communicator.email.from,
                to: emailDetails.emailTo,
                subject: emailDetails.subject,
                html: emailDetails.emailBody,
            });
            logger.error(`Email wa sent to : ${emailDetails.emailTo}: ${info.messageId} ${nodemailer.getTestMessageUrl(info)}`)
            return callback(null);
        } catch (error) {
            logger.error(`Error in sending mail to : ${emailDetails.emailTo} Mail Body: ${emailDetails.msgBody} ${JSON.stringify(error)}`);
            return callback({code: constants.RESPONSE_CODES.ERROR.EMAIL_SENDING_FAILURE});
        }
    }
}

module.exports = new CommunicationService();

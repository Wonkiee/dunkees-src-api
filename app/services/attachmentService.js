
const fs = require('fs');
const ejs = require('ejs');

const BaseService = require('./baseService');
const config = require('../../app/configurations');
const constants = require('../utils/constants');
const loggerModule = require('../../app/utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.SERVICES.ATTACHMENT_SERVICE);

class AttachmentService extends BaseService {

    constructor() {
        super();
    }

    /**
     * Generate email content from ejs file
     *
     * @param {String} fileName - File name of ejs template
     * @param {Object} content - Email content
     * @returns {*}
     */
    generateContentBody(fileName, content) {
        logger.info(`Generate body content for file: ${fileName}`);
        try {
            const file = './app/resources/templates/' + fileName + '.ejs';
            const compiled = ejs.compile(fs.readFileSync(file, 'utf8'));
            logger.info(`File found: " ${file}`);
            return compiled(content);
        } catch (err) {
            if (err) {
                logger.error(`'Error occurred when generating content for file: ${fileName} ${JSON.stringify(err)}`);
                return false;
            }
        }
    }
}

module.exports = new AttachmentService();

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 13:34:05
 * @modify date 2020-04-11 13:34:05
 * @desc [Loggeer class - This will log API's activities to a log file to monitor]
 */

const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('../configurations');
const constants = require('../utils/constants');

class Logger {

    /**
     * Configure the logger module
     * @param {service} service - service used
    */
    configureLogger(service) {
        const transport = new (winston.transports.DailyRotateFile)({
            filename: config.logger.file_path,
            frequency: config.logger.frequency,
            level: config.logger.level,
            datePattern: constants.LOGGER_MODULE.LOG_FILE_DATE_FORMAT,
            zippedArchive: true,
            maxSize: constants.LOGGER_MODULE.LOG_FILE_MAX_SIZE,
            maxFiles: constants.LOGGER_MODULE.MAX_FILES
        });

        const logger = winston.createLogger({
            format: winston.format.json(),
            defaultMeta: { service: service },
            transports: [
                transport
            ]
        });
        return logger;
    }

    /**
     * Get the logger module
     * @param {service} service - service used
    */
    getLogger(service) {
        return this.configureLogger(service);
    }
}

module.exports = Logger;

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@hotmail.com]
 * @create date 2020-04-1 11:30:06
 * @desc [Starts the mandotory services to run the app]
 */

const safeJsonStringify = require('safe-json-stringify');

const constants = require('./app/utils/constants');
const loggerModule = require('./app/utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.SERVICE_INITIALLIZER);
const mongoDbManager = require('./app/dao/database/connection');

class ServiceInitiallizer {

    constructor() {
    }

    /**
     * Initialize required services for application start
    */
    initServices() {
        return new Promise((resolve, reject) => {
            ServiceInitiallizer.initMongoDb()
                .then(resolve)
                .catch((err) => {
                    return reject(safeJsonStringify(err));
                });
        });
    };

    /**
     * Initializing Mongo Database Connection
    */
    static initMongoDb() {
        return new Promise((resolve, reject) => {
            mongoDbManager.init()
                .then(() => {
                    logger.info('[MONGO DATABASE CONNECTION] Successfully Initialized Mongo Connection');
                })
                .then(resolve)
                .catch((err) => {
                    return reject(`[MONGO DATABASE CONNECTION] Error in Connecting to Mongo Database: ${safeJsonStringify(err)}`);
                });
        });
    }
}

module.exports = new ServiceInitiallizer();

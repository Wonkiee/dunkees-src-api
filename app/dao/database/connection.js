/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@hotmail.com]
 * @create date 2020-04-1 11:10:11
 * @desc [Create mongodb connection]
 */

const mongoose = require('mongoose');

const config = require('../../configurations');
const dbConnectionStr = config.db.connection;
const constants = require('../../utils/constants');
const loggerModule = require('../../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.SERVICE_INITIALLIZER);

mongoose.Promise = global.Promise;

class DbManager {

    /**
     * Initialize Mongo Database Connection
     */
    init() {
        return new Promise((resolve, reject) => {

            mongoose.connect(dbConnectionStr, {
                useCreateIndex: true,
                useFindAndModify: false,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(() => {
                mongoose.set('objectIdGetter', false);

                mongoose.connection.on('connected', function () {
                    logger.info(`Mongoose default connection open to ' ${dbConnectionStr}`);
                });

                mongoose.connection.on('error', function (err) {
                    logger.error(`Mongoose connection error to ' ${dbConnectionStr} ' - '  ${err}`);
                });

                mongoose.connection.on('disconnected', function () {
                });
                return resolve(`Mongoose default connection open to ' ${dbConnectionStr}`);
            }).catch((error) => {
                logger.error(`Mongoose connection error: ${error}`);
                return reject(error);
            });
        });
    }
}

module.exports = new DbManager();

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-17 22:50:14
 * @modify date 2020-04-17 22:50:14
 * @desc [Estimation dao]
 */


const constants = require('../utils/constants');
const estimationModel = require('./models//estimation');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.DAO.ESTIMATION_MODEL);

class EstimationDao {

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Insert a new estimation record  to estimation collection.
     *
     * @param {estimationDetails} orderDetails - Order details object
     * @param {Function} callback - Callback function
     */
    createEstimation(estimationDetails, callback) {

        return estimationModel.create(estimationDetails, (err, docs) => {
            if (err) {
                logger.error(`Error in creating estimation: Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully created the estimation');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve estimation by id.
     *
     * @param {String} id - id of the estimation
     * @param {Function} callback - Callback function
     */
    retrieveEstimationById(id, callback) {

        return estimationModel.findOne({
            _id: id
        }).exec((err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving estimation details by id: Error: ${JSON.stringify(err)}`);
                return callback(err);
            }

            if (!docs) {
                logger.error('Record not found');
                return callback({
                    code: constants.RESPONSE_CODES.ERROR.RECORD_NOT_FOUND
                });
            }

            logger.info('Successfully retrieved the estimation');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve all estimations.
     *
     * @param {Function} callback - Callback function
     */
    retrieveAllEstimations(callback) {

        return estimationModel.find({}).exec((err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving all the estimations: Error: ${JSON.stringify(err)}`);
                return callback(err);
            }

            if (!docs) {
                logger.error('Record not found');
                return callback({
                    code: constants.RESPONSE_CODES.ERROR.RECORD_NOT_FOUND
                });
            }

            logger.info('Successfully retrieved the estimation');
            return callback(null, docs);
        });
    }

    /**
     * Delete estimation by id
     *
     * @param {String} id - User email
     * @param {Function} callback - Callback function
     */
    deleteEstimationById(id, callback) {

        return estimationModel.deleteOne({
            _id: id
        }, (err, doc) => {
            if (err) {
                logger.error(`Failed to delete the estimation for the id: ${id} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully deleted the estimation for the id: ${id}`);
            return callback(null, doc);
        });
    }

    /**
     * Update estimation by id
     *
     * @param {String} id - estimation id
     * @param {Array} itemList - itemList
     * @param {Function} callback - Callback function
     */
    updateEstimationById(id, itemList, callback) {

        return estimationModel.findOneAndUpdate({ _id: id }, { items: itemList }, { upsert: true }, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the estimation for the id: ${id} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully updated the estimation for the id: ${id}`);
            return callback(null, doc);
        });
    }
}

module.exports = new EstimationDao();

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 23:06:49
 * @modify date 2020-04-12 23:06:49
 * @desc [PasswordResetService]
 */

const _ = require('lodash');

const BaseService = require('./baseService');
const constants = require('../utils/constants');
const estimationDao = require('../dao/estimationDao');
const orderDao = require('../dao/orderDao');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.SERVICES.ORDER_SERVICE);

class OrderService extends BaseService {

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Create a new order with estimation.
     *
     * @param {Object} reqBody - Request body object
     * @param {Function} callback - Callback function
     */
    createOrder(reqBody, callback) {

        const itemList = reqBody.items;
        if (!reqBody || !itemList || _.isEmpty(itemList)) {
            logger.error('Error occurred in retrieving order details by id: Required fields are missing');
            return callback({
                code: constants.RESPONSE_CODES.ERROR.ORDER_ITEM_ERROR
            });
        }

        return estimationDao.createEstimation({ items: itemList }, (err, docs) => {
            if (err) {
                logger.error(`Error in creating estimation for the order: Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully created the estimation- Creating the order now');

            const orderDetails = JSON.parse(JSON.stringify(reqBody));
            delete orderDetails.items;
            orderDetails.estimation = docs._id;

            return orderDao.createOrder(orderDetails, (err, json) => {
                if (err) {
                    logger.error(`Error in creating the order: Error: ${JSON.stringify(err)}`);
                    return callback(err);
                }
                logger.info('Successfully created the order');
                return callback(null, json._id);
            })
        });
    }

    /**
     * Retrieve an order by id.
     *
     * @param {String} id - id of the order
     * @param {Function} callback - Callback function
     */
    retrieveOrderWithEstimationById(id, callback) {

        if (!id) {
            logger.error('Error occurred in retrieving order details by Id. ID is empty');
            return callback({
                code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING
            });
        }

        return orderDao.retrieveOrderWithEstimationById(id, (err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving order details by id: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully retrieved the order');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve an order by email.
     *
     * @param {String} id - id of the order
     * @param {Function} callback - Callback function
     */
    retrieveOrderWithEstimationByEmail(email, callback) {

        if (!email) {
            logger.error('Error occurred in retrieving order details by email. Email is empty');
            return callback({
                code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING
            });
        }

        return orderDao.retrieveOrderWithEstimationByEmail(email, (err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving order details by email: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully retrieved the order');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve all orders with estimation by email.
     *
     * @param {String} id - id of the order
     * @param {Function} callback - Callback function
     */
    retrieveAllOrdersWitEstimationByEmail(email, callback) {

        if (!email) {
            logger.error('Error occurred in retrieving all the order details by email. email is empty');
            return callback({
                code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING
            });
        }

        return orderDao.retrieveAllOrdersWitEstimationByEmail(email, (err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving all orders details by email: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully retrieved all the orders');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve orders with estimation.
     *
     * @param {Object} reqDetails - Requets details object
     * @param {Function} callback - Callback function
     */
    retrieveOrderWithEstimation(reqDetails, callback) {
        if (reqDetails.type === constants.STRING_CONSTANTS.ID) {
            return this.retrieveOrderWithEstimationById(reqDetails.id, callback);
        }
        return this.retrieveAllOrdersWitEstimationByEmail(reqDetails.email, callback);
    }

    /**
     * Update order details with email
     *
     * @param {Object} reqBody - Request body object
     * @param {Function} callback - Callback function
     */
    updateOrderById(reqBody, callback) {

        if (!reqBody || !reqBody.id) {
            logger.error('Error occurred in retrieving order details by id: Required fields are missing');
            return callback({
                code: constants.RESPONSE_CODES.ERROR.ORDER_ITEM_ERROR
            });
        }
        return orderDao.retrieveOrderWithEstimationById(reqBody.id, (err, docs) => {
            if (err) {
                logger.error(`Error in getting order with estimation: Error: ${JSON.stringify(err)}`);
                return callback(err);
            }

            const orderDetails = JSON.parse(JSON.stringify(reqBody));
            delete orderDetails.items;

            if (!reqBody.items || _.isEmpty(reqBody.items)) {
                return this.updateOrderCollectionOnlyById(orderDetails, callback);
            }

            return estimationDao.updateEstimationById(docs.estimation, reqBody.items, (err, docs) => {
                if (err) {
                    logger.error(`Error in updating estimation for the order: Error: ${JSON.stringify(err)}`);
                    return callback(err);
                }
                logger.info('Successfully updated the estimation- Updating the order now');

                return this.updateOrderCollectionOnlyById(orderDetails, callback);
            });
        });
    }

    /**
    * Update order collection only by id
    *
    * @param {Object} orderDetails - Order details
    * @param {Function} callback - Callback function
    */
    updateOrderCollectionOnlyById(orderDetails, callback) {
        return orderDao.updateOrderById(orderDetails, (err, json) => {
            if (err) {
                logger.error(`Error in updating the order: Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully updated the order');
            return callback(null, json._id);
        });
    }

    /**
    * Delete order by email
    *
    * @param {Object} reqBody - Request body
    * @param {Function} callback - Callback function
    */
   deleteOrderByEmail(reqBody, callback) {

        if (!reqBody || !reqBody.email) {
            logger.error('Error occurred in deletting order by email. required fields are empty');
            return callback({
                code: constants.RESPONSE_CODES.ERROR.REQUIRED_FIELDS_MISSING
            });
        }

        return orderDao.deleteOrderByEmail(reqBody.email, (err, json) => {
            if (err) {
                logger.error(`Error in deleting the order: Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully deleted the order');
            return callback(null, json._id);
        });
    }
}

module.exports = new OrderService();

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-17 20:14:41
 * @modify date 2020-04-17 20:14:41
 * @desc [Order dao]
 */

const constants = require('../utils/constants');
const orderModel = require('./models/order');
const loggerModule = require('../utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.DAO.ORDER_MODEL);

class OrderDao {

    /**
     * Constructor
     */
    constructor() {
    }

    /**
     * Insert a new order to oder collection.
     *
     * @param {orderDetails} orderDetails - Order details object
     * @param {Function} callback - Callback function
     */
    createOrder(orderDetails, callback) {

        return orderModel.create(orderDetails, (err, docs) => {
            if (err) {
                logger.error(`Error in creating order: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully created the order');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve an order with estimation by email.
     *
     * @param {String} email - Email address of the user
     * @param {Function} callback - Callback function
     */
    retrieveOrderWithEstimationByEmail(email, callback) {

        return orderModel.findOne({
            email: email
        }).populate(constants.MONGO_COLLECTIONS.ESTIMATION).exec((err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving order details by email: ${JSON.stringify(err)}`);
                return callback(err);
            }

            if (!docs) {
                logger.error('Record not found');
                return callback({
                    code: constants.RESPONSE_CODES.ERROR.RECORD_NOT_FOUND
                });
            }

            logger.info('Successfully retrieved the order');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve an order with estimation by id.
     *
     * @param {String} id - id of the order
     * @param {Function} callback - Callback function
     */
    retrieveOrderWithEstimationById(id, callback) {

        return orderModel.findOne({
            _id: id
        }).populate(constants.MONGO_COLLECTIONS.ESTIMATION).exec((err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving order details with estimation by id: ${JSON.stringify(err)}`);
                return callback(err);
            }

            if (!docs) {
                logger.error('Record not found');
                return callback({
                    code: constants.RESPONSE_CODES.ERROR.RECORD_NOT_FOUND
                });
            }
            logger.info('Successfully retrieved order with estimation');
            return callback(null, docs);
        });
    }

    /**
     * Retrieve all orders with estimation by email.
     *
     * @param {String} email - Email address of the user
     * @param {Function} callback - Callback function
     */
    retrieveAllOrdersWitEstimationByEmail(email, callback) {

        return orderModel.find({
            email: email
        }).populate(constants.MONGO_COLLECTIONS.ESTIMATION).exec((err, docs) => {
            if (err) {
                logger.error(`Error occurred in retrieving all orders details by email: ${JSON.stringify(err)}`);
                return callback(err);
            }

            if (!docs) {
                logger.error('Record not found');
                return callback({
                    code: constants.RESPONSE_CODES.ERROR.RECORD_NOT_FOUND
                });
            }

            logger.info('Successfully retrieved all the orders');
            return callback(null, docs);
        });
    }

    /**
     * Delete order by email
     *
     * @param {String} email - User email
     * @param {Function} callback - Callback function
     */
    deleteOrderByEmail(email, callback) {

        return orderModel.deleteOne({
            email: email
        }, (err, doc) => {
            if (err) {
                logger.error(`Failed to delete the order for user email: ${email} Error: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info(`Successfully deleted the order for user email: ${email}`);
            return callback(null, doc);
        });
    }

    /**
     * Update order details with email
     *
     * @param {orderDetails} orderDetails - User details object
     * @param {Function} callback - Callback function
     */
    updateOrderById(orderDetails, callback) {

        const order = JSON.parse(JSON.stringify(orderDetails));
        delete order.id;
        return orderModel.findOneAndUpdate({ _id: orderDetails.id }, order, { upsert: true }, (err, doc) => {
            if (err) {
                logger.error(`Failed to update the token details: ${JSON.stringify(err)}`);
                return callback(err);
            }
            logger.info('Successfully updated token details');
            return callback(null, doc);
        });
    }
}

module.exports = new OrderDao();

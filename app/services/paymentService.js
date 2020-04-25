/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-17 12:17:01
 * @modify date 2020-04-17 12:17:01
 * @desc [Payment service - Process all the operations related to payments]
 */

const BaseService = require('./baseService');
const config = require('../../app/configurations');
const constants = require('../utils/constants');
const loggerModule = require('../../app/utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.SERVICES.PAYMENT_SERVICE);

class PaymentService extends BaseService {

    constructor() {
        super();
    }

}

module.exports = new PaymentService();

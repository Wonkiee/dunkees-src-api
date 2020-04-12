/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 00:01:48
 * @modify date 2020-04-12 00:01:48
 * @desc [Field validator]
 */


const expressErrorUtil = require('util');
const constants = require('./constants');

class FieldValidator {

    /**
     * Validate request fields
     *
     * @param {Object} req - Request object
     * @param {Object} res - Response object
     * @param {Object} fields - Fields to be validated
     * @returns {Boolean}
     */
    emptyFieldValidation(req, res, ...fields) {
        for (let field of fields) {
            let tempField = field;
            let items = tempField.split('.');

            if (items.length > 1) {
                tempField = items;
            }
            req.check(tempField).notEmpty();
        }

        let errors = req.validationErrors();
        if (errors) {
            return res.status(constants.RESPONSE_CODES.ERROR.BAD_REQUEST)
                .json(JSON.stringify(expressErrorUtil.inspect(errors)));
        }
        return false;
    }

    /**
    * Validate query parameters
    *
    * @param {Object} req - Request object
    * @param {Object} res - Response object
    * @param {Object} fields - Fields to be validated
    * @returns {Boolean}
    */
    emptyParamsValidation(req, res, ...params) {
        for (let param of params) {
            req.checkParams(param).notEmpty();
        }

        const errors = req.validationErrors();
        if (errors) {
            return res.status(constants.RESPONSE_CODES.ERROR.BAD_REQUEST)
                .json(JSON.stringify(expressErrorUtil.inspect(errors)));
        }
        return false;
    }
}

module.exports = new FieldValidator();

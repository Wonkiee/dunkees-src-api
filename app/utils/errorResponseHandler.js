/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 00:17:47
 * @modify date 2020-04-12 00:17:47
 * @desc [Error response handler]
 */


const constants = require('./constants');

class ErrorResponseHandler {

    constructor() {

    }

    handleErrorResponse(res, err) {

        res.setHeader(constants.HTTP_HEADER.CONTENT_TYPE, constants.HTTP_HEADER.APPLICATION_JSON);
        if (err.code) {
            switch (err.code) {
                case constants.RESPONSE_CODES.ERROR.BAD_REQUEST:
                    return res.sendStatus(constants.RESPONSE_CODES.ERROR.BAD_REQUEST);
                case constants.RESPONSE_CODES.ERROR.NOT_FOUND:
                    return res.sendStatus(constants.RESPONSE_CODES.ERROR.NOT_FOUND);
                case constants.RESPONSE_CODES.ERROR.UNAUTHORISED:
                    return res.sendStatus(constants.RESPONSE_CODES.ERROR.UNAUTHORISED);
                case constants.RESPONSE_CODES.ERROR.USER_EXISTS:
                    return res.sendStatus(constants.RESPONSE_CODES.ERROR.UNAUTHORISED);
                default:
                    return res.sendStatus(constants.RESPONSE_CODES.ERROR.INTERNAL_SERVER_ERROR);
            }
        }
        return res.sendStatus(constants.RESPONSE_CODES.ERROR.INTERNAL_SERVER_ERROR);
    }
}

module.exports = new ErrorResponseHandler();

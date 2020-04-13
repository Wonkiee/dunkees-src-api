/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 23:06:07
 * @modify date 2020-04-11 23:06:07
 * @desc [Authentication service]
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const safeJsonStringify = require('safe-json-stringify');

const BaseService = require('./baseService');
const config = require('../../app/configurations');
const constants = require('../utils/constants');
const loggerModule = require('../../app/utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.AUTH_SERVICE);

class AuthService extends BaseService {

    constructor() {
        super();
    }

    /**
     * Generate jwt using the user email
     *
     * @param {String} email - User email address
     * @returns {String} token - jwt token
     */
    generateJWT(email) {

        try {
            const authenticationConfig = config.authentication;
            const privateKey = fs.readFileSync(config.authentication.private_key_path, 'utf8');
            return jwt.sign({ email: email }, privateKey, {
                algorithm: 'RS256',
                expiresIn: authenticationConfig.jwt_expire_time * 60
            });

        } catch (err) {
            logger.error(`Error in JWT signing: ${safeJsonStringify(err)}`);
            return false;
        }
    }

}

module.exports = new AuthService();

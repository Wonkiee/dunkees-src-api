/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 23:43:26
 * @modify date 2020-04-11 23:43:26
 * @desc [Login route]
 */

const express = require('express');
const router = express.Router();

const errorResponseHandler = require('../app/utils/errorResponseHandler');
const userService = require('../app/services/userService');
const authService = require('../app/services/authService');
const constants = require('../app/utils/constants');

/**
 * Login a user
 */
router.post('/', (req, res) => {

    const reqBody = req.body;
    return userService.loginUser(reqBody, (err) => {
        if (err) {
            return errorResponseHandler.handleErrorResponse(res, err);
        }

        const jwtToken = authService.generateJWT(reqBody.email);

        if (!jwtToken) {
            return res.status(constants.RESPONSE_CODES.ERROR.UNAUTHORISED).json({ code: constants.ERRORS.JWT_ERROR });
        }

        return res.json({
            success: true,
            message: constants.CUSTOM_MESSEGES.AUTHENTICATION_SUCCESSFULL,
            token: jwtToken
        });
    });
});

/**
 * Login a guest user
 */
router.post('/guest-user', (req, res) => {

    return userService.loginGuestUser(req.body, (err) => {
        if (err) {
            return errorResponseHandler.handleErrorResponse(res, err);
        }

        const jwtToken = authService.generateJWT(constants.GUEST_USER.EMAIL);

        if (!jwtToken) {
            return res.sendStatus(constants.RESPONSE_CODES.ERROR.UNAUTHORISED).json({ code: constants.ERRORS.JWT_ERROR });
        }

        return res.json({
            success: true,
            message: constants.CUSTOM_MESSEGES.AUTHENTICATION_SUCCESSFULL,
            token: jwtToken
        });
    });
});

module.exports = router;

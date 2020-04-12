/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 13:49:42
 * @modify date 2020-04-12 13:49:42
 * @desc [Health End Point]
 */

const express = require('express');
const router = express.Router();

const constants = require('../app/utils/constants');

router.get('/', (req, res) => {
	const healthcheck = {
		uptime: process.uptime(),
		status: constants.CUSTOM_MESSEGES.SERVER_STATUS.RUNNING,
		timestamp: Date.now()
	};
	try {
		res.status(constants.RESPONSE_CODES.SUCCESS.SUCCESS).json(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(constants.RESPONSE_CODES.ERROR.SERVICE_UNAVAILABLE).json(healthcheck);
	}
});

module.exports = router;

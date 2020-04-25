/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 02:30:03
 * @modify date 2020-04-12 02:30:03
 * @desc [Order route - All the processes related to orders will be handled through this route]
 */

const express = require('express');
const router = express.Router();

const orderService = require('../app/services/orderService');
const fieldValidator = require('../app/utils/fieldValidator');
const errorResponseHanlder = require('../app/utils/errorResponseHandler');

/**
 * Create a order
 */
router.post('/create', (req, res) => {

    return orderService.createOrder(req.body, (locErr, orderCreateRes) => {
        if (locErr) {
            return errorResponseHanlder.handleErrorResponse(res, locErr);
        }
        return res.json(orderCreateRes);
    })
});

/**
 * Get an order by id or email
 */
router.get('/get-order/:type/:value', (req, res) => {

    const hasError = fieldValidator.emptyParamsValidation(req, res, 'type', 'value');
    if (hasError) {
        return hasError
    }

    return orderService.retrieveOrderWithEstimation({
        type: req.params.type,
        value: req.params.value
    }, (locErr, getOrdersRes) => {
        if (locErr) {
            return errorResponseHanlder.handleErrorResponse(res, locErr);
        }
        return res.json(getOrdersRes);
    })
});

/**
 * Get all orders by email
 */
router.get('/get-all-orders/:email', (req, res) => {

    const hasError = fieldValidator.emptyParamsValidation(req, res, 'email');
    if (hasError) {
        return hasError
    }

    return orderService.retrieveAllOrdersWitEstimationByEmail(req.params.email, (locErr, getAllOrdersRes) => {
        if (locErr) {
            return errorResponseHanlder.handleErrorResponse(res, locErr);
        }
        return res.json(getAllOrdersRes);
    });
});

/**
 * Update an order by order id
 */
router.patch('/update-order/', (req, res) => {

    return orderService.updateOrderById(req.body, (locErr, orderUpdateRes) => {
        if (locErr) {
            return errorResponseHanlder.handleErrorResponse(res, locErr);
        }
        return res.json(orderUpdateRes);
    });
});


/**
 * Delete an order by email
 */
router.delete('/delete-order/', (req, res) => {

    return orderService.deleteOrderByEmail(req.body, (locErr, orderDeleteRes) => {
        if (locErr) {
            return errorResponseHanlder.handleErrorResponse(res, locErr);
        }
        return res.json(orderDeleteRes);
    });
});


module.exports = router;

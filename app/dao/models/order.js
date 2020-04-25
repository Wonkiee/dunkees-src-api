/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-17 18:10:01
 * @modify date 2020-04-17 18:10:01
 * @desc [Order model]
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentStatus = require('../../utils/enums/paymentStatus');
const orderStatus = require('../../utils/enums/orderStatus');

const orderSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    contact: {
        type: Object,
        required: true
    },
    estimation: {
        type: Schema.Types.ObjectId,
        ref: 'estimation',
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: [paymentStatus.PENDING, paymentStatus.COMPLETED]
    },
    orderStatus: {
        type: String,
        required: true,
        enum: [orderStatus.CREATED, orderStatus.PLACED, orderStatus.DELIVERED]
    }
}, {
    collection: 'order',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('order', orderSchema);

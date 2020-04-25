/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-17 20:09:33
 * @modify date 2020-04-17 20:09:33
 * @desc [Estimation model]
 */

const mongoose = require('mongoose');

const estimationSchema = new mongoose.Schema({
    items: [{
        item: String,
        quant: Number
    }]
}, {
    collection: 'estimation',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('estimation', estimationSchema);

/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-12 22:28:39
 * @modify date 2020-04-12 22:28:39
 * @desc [Utility functions]
 */

const shortid = require('shortid');

class Functions {

    constructor() {

    }

    generateCustomToken() {
        return shortid.generate();
    }
}

module.exports = new Functions();

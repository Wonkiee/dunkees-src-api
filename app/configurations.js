/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 13:29:23
 * @modify date 2020-04-11 13:29:23
 * @desc [Load configurations from config file]
 */

/**
 * Load configurations based on environment configs
 */
const configFilePath = "/etc/dunkees_conf/dunkees_api/";
const configuration = function() {
    let config;

    try {
        process.env["NODE_CONFIG_DIR"] = configFilePath;
        config = require("config");
        console.log('Config file exists in ', configFilePath);
    } catch (e) {
        console.log(e);
    }
    return config;
};

module.exports = new configuration();

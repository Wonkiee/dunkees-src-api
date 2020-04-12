/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 18:02:42
 * @modify date 2020-04-11 18:02:42
 * @desc [This file has all the constants]
 */

module.exports = {
    LOGGER_MODULE: {
        SERVICE: {
            SERVICE_INITIALLIZER: 'SERVICE INITIALLIZER',
            DB_CONNECTION: 'DATABASE CONNECTION',
            WWW: 'BIN/WWW',
            AUTH_SERVICE: 'AUTH SERVICE',
            APP: 'APP',
            MODELS: {
                USER: 'USER MODEL'
            },
            SERVICES: {
                USER: 'USER SERVICE'
            }
        },
        LOG_FILE_DATE_FORMAT: 'YYYY-MM-DD-HH',
        LOG_FILE_MAX_SIZE: '20m',
        MAX_FILES: '31d'
    },
    ERRORS: {
        REQUIRED_FIELDS_MISSING: 'REQUIRED_FIELDS_MISSING',
        INCORRECT_CREDENTIALS: 'INCORRECT_USER_CREDENTIALS',
        JWT_ERROR: 'JWT_TOKEN_ERROR'
    },
    RESPONSE_CODES: {
        SUCCESS: {
            SUCCESS: 200,
            CREATED: 201,
            NO_CONTENT: 204,
        },
        ERROR: {
            BAD_REQUEST: 400,
            UNAUTHORISED: 401,
            ACCESS_DENIED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            GONE: 410,
            INTERNAL_SERVER_ERROR: 500,
            SERVICE_UNAVAILABLE: 503,

            //Custom Error Codes
            REQUIRED_FIELDS_MISSING: 100500,
            INCORRECT_CREDENTIALS: 100501,
        }
    },
    HTTP_HEADER: {
        APPLICATION_JSON: 'application/json',
        APPLICATION_PDF: 'application/pdf',
        APPLICATION_FROM_URLENCODED: 'application/x-www-form-urlencoded',
        CONTENT_TYPE: 'content-type',
        AUTHORIZATION: {
            BEARER: 'Bearer'
        }
    },
    GUEST_USER: {
        EMAIL: 'guestuser@dunkees.com'
    },
    CUSTOM_MESSEGES: {
        AUTHENTICATION_SUCCESSFULL: 'Authentication successful!',
        OK: 'OK',
        SERVER_STATUS: {
            RUNNING: 'RUNNING'
        }
    },
    JWT: {
        EXCLUDED_PATHS: ['/api/user/create', '/api/login', '/api/health-check']
    }
}

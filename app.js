/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 22:11:23
 * @modify date 2020-04-11 22:11:23
 * @desc [App]
 */

const createError = require('http-errors');
const express = require('express');
const expressValidator = require('express-validator');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./app/configurations');
const fs = require('fs');
const jwt = require('express-jwt');

const constants = require('./app/utils/constants')
const loggerModule = require('./app/utils/logger');
const logger = new loggerModule().getLogger(constants.LOGGER_MODULE.SERVICE.APP);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const loginRoute = require('./routes/login');
const healthRoute = require('./routes/health');

var app = express();
app.use(expressValidator());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// JWT verification
const certFile = fs.readFileSync(config.authentication.cert_file_path, 'utf8');
app.use(jwt({
  secret: certFile,
  getToken: function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
}).unless({ path: constants.JWT.EXCLUDED_PATHS }));

//Throw an error if JWT isn't validated.
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.error(`Error in JWT verification from ${ip} : ${JSON.stringify(err)}`);
    return res.status(403).json({ message: err.message });
  }
  return next();
});

//End Points
app.use('/api/login', loginRoute);
app.use('/api/health-check', healthRoute);
app.use('/api/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

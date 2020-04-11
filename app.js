/**
 * @author [Rajitha Rajasooriya]
 * @email [rajitharajasooriya@mail.com]
 * @create date 2020-04-11 22:11:23
 * @modify date 2020-04-11 22:11:23
 * @desc [App]
 */

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./app/configurations');
const fs = require('fs');
const jwt = require('express-jwt');

const loggerModule = require('./app/utils/logger');
const logger = new loggerModule().getLogger();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const loginRoute = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRoute);


// JWT verification
const privateKey = fs.readFileSync('', 'utf8');
app.use(jwt({
  secret: privateKey,
  getToken: function (req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
      }
      return null;
  }
}));

// Throw an error if JWT isn't validated.
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      logger.error('Error in JWT verification from ' + ip + ' : ' + err);
      return res.status(403).json({message: err.message});
  }
  next();
});

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

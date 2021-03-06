'use strict';
const env = process.env.NODE_ENV || 'development';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('winston');
const lodashExpress = require('lodash-express');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
lodashExpress(app, 'html');
app.set('view engine', 'html');

const winstonStream = {
  write: message => {
    logger.info(message.slice(0, -1));
  }
};

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('combined', { stream: winstonStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

const propertiesRoute = require('./routes/properties');
app.use('/v1/properties', propertiesRoute);

app.get('/', (req, res) => {
  res.redirect(301, '/docs/v1/index.html');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    logger.error(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  logger.error(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

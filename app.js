var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var expressValidator = require('express-validator');//Add by myself
var flash = require('express-flash');//Add by myself
var session = require('express-session');//Add by myself
var bodyParser = require('body-parser');//Add by myself

//var mysql = require('mysql');Add by myself
//var connection  = require('./lib/db');Add by myself

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(bodyParser.json());//Add by myself
app.use(bodyParser.urlencoded({ extended: true }));//Add by myself


//app.use(express.json());//Deleted by myself
//app.use(express.urlencoded({ extended: false }));//Deleted by myself

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ //Add by myself
  secret: '123456cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(flash());//Add by myself
app.use(expressValidator());//Add by myself

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

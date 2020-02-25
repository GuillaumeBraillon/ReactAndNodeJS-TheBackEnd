var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator());

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

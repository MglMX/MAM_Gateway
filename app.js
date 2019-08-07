var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./config/passport');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var channelsRouter = require('./routes/channels');
var groupsRouter = require('./routes/groups')
var schemasRouter = require('./routes/schemas')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/channels', channelsRouter);
app.use('/groups', groupsRouter);
app.use('/schemas', schemasRouter);

var models = require("./models");

module.exports = app;

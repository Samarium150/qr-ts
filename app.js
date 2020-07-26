'use strict'
const express = require('express');
const path = require('path');

const indexRouter = require('./routes/index');
const exampleRouter = require('./routes/example');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/example.html', exampleRouter);

module.exports = app;

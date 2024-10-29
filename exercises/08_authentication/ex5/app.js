'use strict';

const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const app = express();

// Use express's body-parser middleware
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Log function (unreachable code corrected)
function log(error = "") {
    console.log(`Oops! Something went wrong: ${error}`);
    return 0;
}

module.exports = app;

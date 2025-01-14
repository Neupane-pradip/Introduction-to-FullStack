'use strict';

(() => {
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

    // Convert function declaration to arrow function
    const log = (error = "") => {
        console.log(`Oops! Something went wrong: ${error}`);
        return 0;
    };

    // Optionally expose the log function if needed
    module.exports = { app, log };
})();
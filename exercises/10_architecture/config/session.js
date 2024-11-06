const session = require('express-session');
require('dotenv').config();

const sessionConfig = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
});

module.exports = sessionConfig;
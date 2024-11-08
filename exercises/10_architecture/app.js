const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
const connectDB = require('./config/database');
const sessionConfig = require('./config/session');
const app = express();

// Middleware and other configurations
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(sessionConfig));

// View engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

// Import the route files
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

// Middleware to protect routes
function usersOnly(req, res, next) {
    if (req.session && req.session.user) return next();
    return res.redirect('/login');
}

// Set up route mappings
app.use('/events', usersOnly, eventRoutes); // Protected event routes
app.use('/users', userRoutes);              // Public user routes

// Redirect root to events
app.get('/', usersOnly, (req, res) => res.redirect('/events'));

// Export app for tests
module.exports = app;

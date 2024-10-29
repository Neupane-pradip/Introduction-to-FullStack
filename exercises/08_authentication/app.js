(() => {
    'use strict';

    const express = require('express');
    const path = require('path');
    const session = require('express-session');
    const bodyParser = require('body-parser');
    const { v4: uuid } = require('uuid');
    const bcrypt = require('bcrypt');

    const users = require('./test_data/users.json');
    const events = require('./test_data/events.json');

    // Create Express application
    const app = express();

    // Use EJS templating library
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '/views'));

    // Serve static files automatically (in this case, CSS)
    app.use(express.static(path.join(__dirname, 'public')));

    // Set up body-parser. This will accept POST data and append them to the req object
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json()); // This will also accept JSON from the tests

    // Set up sessions
    app.use(session({
        secret: 'my-super-secret-key',
        resave: false,
        saveUninitialized: true
    }));

    // Middleware for authenticated users only
    const usersOnly = (req, res, next) => {
        // Happy path, the request may pass through
        if (req.session && req.session.user) {
            return next();
        }

        // Unhappy path, the request is intercepted and rejected
        return res.redirect('/login');
    };

    // Middleware for admin users only
    const adminOnly = (req, res, next) => {
        // Since this middleware will be used after usersOnly,
        // we can assume req.session.user exists
        if (req.session.user.role === 'admin') {
            return next();
        }

        // If not admin, redirect back to events page
        return res.redirect('/events');
    };

    app.get('/', usersOnly, (req, res) => res.redirect('/events'));

    app.get('/events', usersOnly, (req, res) => {
        const user = req.session.user;
        return res.render('events/index', { title: 'Dashboard', user, events });
    });

    app.get('/events/create', usersOnly, (req, res) => {
        const user = req.session.user;
        const errors = req.session.errors || [];
        delete req.session.errors;

        const event = req.session.event || { 
            name: "", 
            date: "", 
            description: "", 
            status: "planned" 
        };
        delete req.session.event;

        return res.render('events/create', { 
            title: 'Create a new event', 
            user, 
            event, 
            errors 
        });
    });

    app.post('/events', usersOnly, (req, res) => {
        const errors = [];
        const { name, date, status, description } = req.body;
        const newEvent = { name, date, status, description };

        if (!newEvent.date || newEvent.date.trim() === '') {
            errors.push('Date is required!');
        }
        if (!newEvent.name || newEvent.name.trim() === '') {
            errors.push('Name is required!');
        }
        if (!newEvent.status || newEvent.status.trim() === '') {
            newEvent.status = 'planned';
        }
        if (!newEvent.description) {
            newEvent.description = '';
        }

        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.event = newEvent;
            return res.redirect('/events/create');
        }

        newEvent._id = uuid();
        events.push(newEvent);
        return res.redirect('/events');
    });

    app.get('/events/:id', usersOnly, (req, res) => {
        const user = req.session.user;
        const event = events.find(e => e._id === req.params.id);
        
        if (!event) {
            return res.status(404).send();
        }

        const errors = req.session.errors || [];
        delete req.session.errors;

        return res.render('events/edit', { 
            title: `Edit ${req.params.id}`, 
            user, 
            event, 
            errors 
        });
    });

    app.post('/events/:id', usersOnly, (req, res) => {
        const event = events.find(e => e._id === req.params.id);
        if (!event) {
            return res.status(404).send();
        }

        const errors = [];
        const { date, name, description, status } = req.body;
        
        if (!name || name.trim() === '') {
            errors.push('Name is required!');
        }
        if (!date || date.trim() === '') {
            errors.push('Date is required!');
        }

        if (errors.length > 0) {
            req.session.errors = errors;
            return res.redirect(`/events/${req.params.id}`);
        }

        event.date = date;
        event.name = name;
        event.status = status ?? 'planned';
        event.description = description ?? '';

        return res.redirect('/events');
    });

    app.post('/events/:id/delete', usersOnly, adminOnly, (req, res) => {
        const index = events.findIndex(e => e._id === req.params.id);

        if (index !== -1) {
            events.splice(index, 1);
        }

        return res.redirect('/events');
    });

    app.get('/register', (req, res) => {
        const errors = req.session.errors || [];
        delete req.session.errors;
        return res.render('register', { title: 'Register a new user', errors });
    });

    app.post('/register', async (req, res) => {
        const errors = [];
        const { name, email, password } = req.body;
        
        if (!name || name.trim() === '') {
            errors.push('Name is required!');
        }
        if (!email || email.trim() === '') {
            errors.push('Email is required!');
        }
        if (!password || password.trim() === '') {
            errors.push('Password is required!');
        }
        
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            errors.push('Email is already in use!');
        }
        
        if (errors.length > 0) {
            req.session.errors = errors;
            req.session.oldInput = { name, email };
            return res.redirect('/register');
        }

        const id = uuid();
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id,
            name,
            email,
            password: hashedPassword,
            role: 'user'
        };
        
        users.push(newUser);
        req.session.user = newUser;
        return res.redirect('/');
    });

    app.get('/login', (req, res) => {
        const errors = req.session.errors || [];
        delete req.session.errors;
        return res.render('login', { title: 'Log in', errors });
    });

    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        
        if (!user) {
            req.session.errors = ['These credentials do not match our records.'];
            return res.redirect('/login');
        }

        try {
            if (!await bcrypt.compare(password, user.password)) {
                req.session.errors = ['These credentials do not match our records.'];
                return res.redirect('/login');
            }
        } catch (error) {
            return res.status(500).send('Internal server error!');
        }

        req.session.user = user;
        return res.redirect('/');
    });

    app.post('/logout', (req, res) => {
        req.session.destroy();
        return res.redirect('/login');
    });

    // Export functions for tests
    const exportEvents = () => events;
    const exportUsers = () => users;

    // Export the app and utility functions
    const exports = { app, exportEvents, exportUsers };
    module.exports = exports;
})();
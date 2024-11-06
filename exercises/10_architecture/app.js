const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connectDB = require('./config/database');
const sessionConfig = require('./config/session');
const Event = require('./models/Event');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
connectDB();

// Use EJS templating library
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up sessions
app.use(sessionConfig);

// Middleware functions
function usersOnly(req, res, next) {
    if(req.session && req.session.user) return next();
    return res.redirect('/login');
}

// Define routes
app.get('/', usersOnly, (req, res) => {
    return res.redirect('/events');
});

app.get('/events', usersOnly, async (req, res) => {
    const user = req.session.user;
    const events = await Event.find();
    return res.render('events/index', { title: 'Dashboard', user, events });
});

app.get('/events/create', usersOnly, (req, res) => {
    const user = req.session.user;

    //Try to get validation errors out of session
    const errors = req.session.errors || [];
    //Clear validation errors from session
    delete req.session.errors;

    //A "blueprint" of an event to hold old data in case of validation errors
    const event = req.session.event || { name: "", date: "", description: "", status: "planned" };
    delete req.session.event;

    return res.render('events/create', { title: `Create a new event`, user, event, errors });
});

app.post('/events', usersOnly, async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();

        return res.redirect('/events');
    } catch (error) {
        if(error.name === 'ValidationError') {
            const errors = [];
            for(let field in error.errors) {
                errors.push(error.errors[field].message);
            }

            //Store validation errors in the session
            req.session.errors = errors;
            //PRG, Post-Redirect-Get
            return res.redirect(`/events/create`);
        }
    }
});

app.get('/events/:id', usersOnly, async (req, res) => {
    const user = req.session.user;

    const event = await Event.findById(req.params.id);
    if(!event) return res.status(404).send();

    //Try to get validation errors out of session
    const errors = req.session.errors || [];
    //Clear validation errors from session
    delete req.session.errors;

    return res.render('events/edit', { title: `Edit ${req.params.id}`, user, event, errors });
});

app.post('/events/:id', usersOnly, async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: false, runValidators: true });

        if(!event) return res.status(404).send();

        return res.redirect('/events');
    } catch (error) {
        if(error.name === 'ValidationError') {
            const errors = [];
            for(let field in error.errors) {
                errors.push(error.errors[field].message);
            }

            //Store validation errors in the session
            req.session.errors = errors;
            //PRG, Post-Redirect-Get
            return res.redirect(`/events/${req.params.id}`);
        }
    }
});

app.post('/events/:id/delete', usersOnly, async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);

    return res.redirect('/events');
});

app.get('/register', (req, res) => {
    //Try to get validation errors out of session
    const errors = req.session.errors || [];
    //Clear validation errors from session
    delete req.session.errors;

    //Render the view, passing it (among other things) the possible validation errors
    return res.render('register', { title: `Register a new user`, errors });
});

app.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = new User({ email, password, name });
        await user.save();
        req.session.user = user;
        return res.redirect('/');
    } catch (error) {
        if(error.name === 'ValidationError') {
            const errors = [];
            for(let field in error.errors) {
                errors.push(error.errors[field].message);
            }

            //Store validation errors in the session
            req.session.errors = errors;
            //PRG, Post-Redirect-Get
            return res.redirect(`/register`);
        }
    }
});

app.get('/login', (req, res) => {
    //Try to get validation errors out of session
    const errors = req.session.errors || [];
    //Clear validation errors from session
    delete req.session.errors;

    //Render the view, passing it (among other things) the possible validation errors
    res.render('login', { title: 'Log in', errors });
});

app.post('/login', async (req, res) => {
    //Authenticate the user
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        return res.redirect('/');
    } else {
        req.session.errors = ['These credentials do not match our records.'];
        return res.redirect('/login');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy();

    return res.redirect('/login');
});

//Need to export the app for mocha tests to work.
module.exports = app;

const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('./models/Event');
const User = require('./models/User');


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log(`Error connecting to MongoDB`, error);
});

const app = express();

//Use EJS templating library
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

//Serve static files automatically (in this case, CSS)
app.use(express.static(path.join(__dirname, 'public')));

//Set up body-parser. This will accept POST data and append them to the req object
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //this will also accept JSON from the tests

//Set up sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

//Middleware functions can be executed before the route callback is handled
//here, we can, for example, stop the request from being processed further
//if all checks out, we simply call next() to proceed to the next
//middleware function (or the request callback once through all middleware "layers")
function usersOnly(req, res, next) {
    //Happy path, the request may pass through
    if(req.session && req.session.user) return next();

    //Unhappy path, the request is intercepted and rejected
    return res.redirect('/login');
}

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

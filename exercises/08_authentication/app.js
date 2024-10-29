const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt');

const users = require('./test_data/users.json');
const events = require('./test_data/events.json');

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
    secret: 'my-super-secret-key',
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

// New adminOnly middleware
function adminOnly(req, res, next) {
    // Since this middleware will be used after usersOnly,
    // we can assume req.session.user exists
    if (req.session.user.role === 'admin') {
        return next();
    }

    // If not admin, redirect back to events page
    return res.redirect('/events');
}

app.get('/', usersOnly, (req, res) => {
    return res.redirect('/events');
});

app.get('/events', usersOnly, (req, res) => {
    const user = req.session.user;

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

app.post('/events', usersOnly, (req, res) => {
    //Validate the data
    let errors = [];
    const { name, date, status, description } = req.body;
    const newEvent = { name, date, status, description };
    if(!newEvent.date || newEvent.date.trim() === '') errors.push('Date is required!');
    if(!newEvent.name || newEvent.name.trim() === '') errors.push('Name is required!');
    if(!newEvent.status || newEvent.status.trim() === '') newEvent.status = 'planned';
    if(!newEvent.description) newEvent.description = '';

    if(errors.length > 0) {
        //Store validation errors in the session
        req.session.errors = errors;
        //Send back potential old data to use in create -form
        req.session.event = newEvent;
        //PRG, Post-Redirect-Get
        return res.redirect(`/events/create`);
    }

    //Generate a unique id for the new event
    newEvent._id = uuid();
    //"Save" the new event
    events.push(newEvent);

    return res.redirect('/events');
});

app.get('/events/:id', usersOnly, (req, res) => {
    const user = req.session.user;

    const event = events.find(e => e._id === req.params.id);
    if(!event) return res.status(404).send();

    //Try to get validation errors out of session
    const errors = req.session.errors || [];
    //Clear validation errors from session
    delete req.session.errors;

    return res.render('events/edit', { title: `Edit ${req.params.id}`, user, event, errors });
});

app.post('/events/:id', usersOnly, (req, res) => {
    const event = events.find(e => e._id === req.params.id);
    if(!event) return res.status(404).send();

    let errors = [];
    const { date, name, description, status } = req.body;
    if(!name || name.trim() === '') errors.push('Name is required!');
    if(!date || date.trim() === '') errors.push('Date is required!');

    if(errors.length > 0) {
        //Store validation errors in the session
        req.session.errors = errors;
        //PRG, Post-Redirect-Get
        return res.redirect(`/events/${req.params.id}`);
    }

    //Update the event with the new data
    event.date = date;
    event.name = name;
    //These are not required data, so use sensible defaults as backup
    event.status = status ?? 'planned';
    event.description = description ?? '';

    //POST-redirect-GET
    return res.redirect('/events');
});

// Updated delete route with both middlewares
app.post('/events/:id/delete', usersOnly, adminOnly, (req, res) => {
    const index = events.findIndex(e => e._id === req.params.id);

    if (index !== -1) {
        events.splice(index, 1);
    } else {
        //this is odd, someone attempted to remove an item that does not exists...
        //this could be a serious bug or an attempt at malicious activity
    }

    //POST-redirect-GET 
    //(otherwise, client refreshing their browser window would send another unsafe request!)
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
    let errors = [];
    // Get name, email, password from request
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || name.trim() === '') {
        errors.push('Name is required!');
    }
    if (!email || email.trim() === '') {
        errors.push('Email is required!');
    }
    if (!password || password.trim() === '') {
        errors.push('Password is required!');
    }
    
    // Check if email is already in use
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        errors.push('Email is already in use!');
    }
    
    if (errors.length > 0) {
        // Store validation errors in session
        req.session.errors = errors;
        
        // Store old input data (except password) for form repopulation
        req.session.oldInput = {
            name,
            email
        };
        
        // PRG pattern - redirect back to registration form
        return res.redirect('/register');
    }

    // Generate unique id for new user
    const id = uuid();
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user object with role "user"
    const newUser = {
        id,
        name,
        email,
        password: hashedPassword,
        role: 'user'
    };
    
    // Save user to users array
    users.push(newUser);

    // Store user in session (log them in)
    req.session.user = newUser;

    return res.redirect('/');
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

    //First, check if such user exists...
    const user = users.find(u => u.email === email);
    if(!user) {
        req.session.errors = ['These credentials do not match our records.'];
        return res.redirect('/login');
    }

    //...then check their password
    try {
        //We do not have the users password in store, only their hash
        //hence, we can only compare if the provided password retults in same hash
        if(!await bcrypt.compare(password, user.password)) {
            req.session.errors = ['These credentials do not match our records.'];
            return res.redirect('/login');
        }
    } catch (error) {
        res.status(500).send('Internal server error!');
    }

    //Valid user, store in session
    req.session.user = user;
    return res.redirect('/');
});

app.post('/logout', (req, res) => {
    req.session.destroy();

    return res.redirect('/login');
});

//Need to export the app for mocha tests to work.
//exportEvents() gives tests inside into server memory,
//when using a real database, this hack would not be necessary.
function exportEvents() { return events; }
function exportUsers() { return users; }
module.exports = { app, exportEvents, exportUsers };
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

// Initialize the session middleware
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }  // Session valid for 1 minute
}));

// Route: Home Page
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Session Management App</h1>
    <p><a href="/login">Login</a> | <a href="/logout">Logout</a> | <a href="/profile">Profile</a></p>
  `);
});

// Route: Login Page (GET request)
app.get('/login', (req, res) => {
  if (req.session.username) {
    return res.redirect('/profile');
  }
  const htmlForm = `
    <h2>Login</h2>
    <form method="POST" action="/login">
      <label>Username:</label>
      <input type="text" name="username" required>
      <button type="submit">Login</button>
    </form>
  `;
  res.send(htmlForm);
});

// Route: Login (POST request)
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.username = username;
    return res.redirect('/profile');
  }
  res.redirect('/login'); // Redirect back to login if no username is provided
});

// Route: Profile Page (GET request)
app.get('/profile', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }
  const profilePage = `
    <h2>Profile</h2>
    <p>Welcome, ${req.session.username}!</p>
    <p><a href="/logout">Logout</a></p>
  `;
  res.send(profilePage);
});


// Route: Logout (GET request)
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/profile'); // If there's an error, stay on profile
    }
    res.redirect('/');
  });
});
// DO NOT MODIFY BELOW THIS LINE
// Conditionally start the server if this script is run directly
if (require.main === module) {
  app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
  });
}

// For Plussa grader
module.exports = app;
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

// TODO: Route: Login Page (GET request)
// - If logged in: redirect to /profile page
// - If not logged in: display htmlForm below for the login page.
app.get('/login', (req, res) => {
  const htmlForm = 
  `
    <h2>Login</h2>
    <form method="POST" action="/login">
      <label>Username:</label>
      <input type="text" name="username" required>
      <button type="submit">Login</button>
    </form>
  `

});

// TODO: Route: Login (POST request)
// - Handle the login and store the username in the session
// - Redirect to the /profile page after login
app.post('/login', (req, res) => {

});

// TODO: Route: Profile Page (GET request)
// - If logged in: display the profilePage only if the user is logged in
// - If not logged in: redirect to /login page
app.get('/profile', (req, res) => {
  let profilePage = 
  `
    <h2>Profile</h2>
    <p>Welcome, ${req.session.username}!</p>
    <p><a href="/logout">Logout</a></p>
  `

});

// TODO: Route: Logout (GET request)
// Destroy the session and redirect to home
app.get('/logout', (req, res) => {

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
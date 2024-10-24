const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const url = require('url');
const port = 3000;

/**
 * users array
 * information about the only user in the system
 */
const users = [{
  username: 'good_user',
  password: 'good_pass',
  cookie_secret: 1234567890
}]

/**
 * currentUser object
 * This is where the currently logged in user is saved.
 * Only works for one-user systems.
 */
let currentUser = {};

/**
 * csrfTokens array
 * This is where created CSRF tokens are stored
 */
let csrfTokens = [];

const server = http.createServer(function(request, response) {
  // Landing page, where user inputs their login credentials
  if (request.url === '/' || request.url === '') {
    fs.readFile(__dirname + '/good_server.html', function(error, htmlPage) {
      if (error) {
        response.writeHead(404);
        response.end(JSON.stringify(error));
        return;
      } else {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(htmlPage);
      }
      response.end();
      return;
    });
  }
  // The login page directs here, where user's credentials are checked
  else if (request.url === '/login' && request.method === 'POST') {
    let formBody = "";
    request.on('data', function(chunk) {
      formBody += chunk;
    });
    request.on('end', function() {
      const loginInput = querystring.parse(formBody);
      const userArray = checkUser(loginInput.username, loginInput.passw);
      if (userArray.length === 1) {
        currentUser = userArray[0];
        response.setHeader('Set-Cookie', ['secret_for_good_server=' + currentUser.cookie_secret]);
        response.end(
          `
            <!doctype html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <title>The Good Server</title>
            </head>
            <body>
              <p>You have now logged in!</p>
              <p>You can move on to <a href="/money_transfer"> transferring money</a>.</p>
            </body>
            </html>
          `
        );
        return;
      } else {
        response.statusCode = 403;
        response.statusMessage = "Wrong username and/or password!"
        response.end(`${response.statusCode} - Wrong username and/or password!`);
        return;
      }
    })
  }
  else if (request.url.match(/^\/money_transfer.*/)) {
    const cookies = querystring.parse(request.headers['cookie'], '; ');
    const query = url.parse(request.url, true).query;
    
    // Check that the user has a valid cookie
    if (cookies.secret_for_good_server != users[0].cookie_secret) {
      response.statusCode = 403;
      response.statusMessage = "Missing or wrong secret cookie";
      response.end('Missing or wrong secret cookie');
      return;
    }
    // Show the money transfer form if no transfer parameters are present
    else if (!query.to || !query.sum) {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(
        ` 
          <!doctype html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>The Good Server</title>
          </head>
          <body>
            <p>Transfer money to other users with the super safe form which uses the latest HTTP GET method!</p>
            <form action="/money_transfer" method="get">
              <div class="container">
                <label for="from"><b>Transfer from</b></label>
                <input type="text" value="good_user" name="from" required readonly>
                <label for="to"><b>Transfer to</b></label>
                <input type="text" placeholder="User you want to send money to" name="to" required>
                <label for="sum"><b>Sum to transfer (in full Euros)</b></label>
                <input type="number" placeholder="Enter a sum" name="sum" required>
                <input type="hidden" name="csrf_token" value="${setCSRFtoken()}">
                <button type="submit">Transfer money</button>
              </div>
            </form>
          </body>
          </html>
        `
      );
      return;
    }
    // Check CSRF token
    else if (checkCSRFtoken(query.csrf_token) === -1) {
      response.statusCode = 403;
      response.statusMessage = "Missing or wrong CSRF token";
      response.end('Missing or wrong CSRF token');
      return;
    }
    // Process the money transfer
    else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(
        `
          <!doctype html>
          <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>The Good Server</title>
          </head>
          <body>
            <p>The sum of ${query.sum} Euros was transferred from user good_user to user ${query.to}</p>
            <p><a href="/money_transfer/">Perform another money transfer</a></p>            
          </body>
          </html>
        `
      );
      return;
    }
  }
  // Handle unknown routes
  else {
    response.writeHead(404);
    response.write('Page not found or wrong HTTP method used');
    response.end();
    return;
  }
});

/**
 * function checkUser
 * Used to check the login credentials user gave match those in users array
 * @param {*} userName username from request
 * @param {*} password password from the request
 * @returns {Array} A new array with the elements that pass the test
 */
const checkUser = (userName, password) => {
  const userHopefully = users.filter((user) => {
    return (user.username === userName && user.password === password);
  })
  return userHopefully;
}

/**
 * function setCSRFtoken
 * Creates and returns a random string to be used as the CSRF token
 * @returns {string} Random string used as CSRF token
 */
const setCSRFtoken = () => {
  // Generate a random string of 10 characters
  const token = Math.random().toString(36).slice(2, 12);
  // Store the token in our array
  csrfTokens.push(token);
  return token;
}

/**
 * function checkCSRFtoken
 * Checks if the CSRF token exists and removes it if found
 * @param {string} token CSRF token from the request
 * @returns {number} Index of found token or -1 if not found
 */
const checkCSRFtoken = (token) => {
  // Find the index of the token in our array
  const tokenIndex = csrfTokens.findIndex(storedToken => storedToken === token);
  // If token is found, remove it from the array
  if (tokenIndex !== -1) {
    csrfTokens.splice(tokenIndex, 1);
  }
  // Return the index (or -1 if not found)
  return tokenIndex;
}

module.exports = server;

// Start the server if this file is run directly
if (require.main === module) {
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
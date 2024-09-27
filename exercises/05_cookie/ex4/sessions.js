const http = require('http');
const url = require('url');
const querystring = require('querystring');

// In-memory session store
let sessions = {};

// DO NOT EDIT. Function to generate a unique session ID
function generateSessionId() {
    return Math.random().toString(36);
}

// DO NOT EDIT. Function to create a new session
function createSession() {
    const sessionId = generateSessionId();
    sessions[sessionId] = {};
    return sessionId;
}

// Create the HTTP server
const server = http.createServer((req, res) => {
    // TODO: 
    // - Parse cookies from the request headers and extract the session ID.
    // - Save the session ID in variable sessionId declared as a placeholder below.
    let sessionId = null;

    // TODO: 
    // - Check if the session ID exists, if not, create a new session using createSession() 
    // - After generated, set the session ID as a cookie in the response headers.
    // - The cookie should have the following format: sessionId=<sessionId>.


    const session = sessions[sessionId]; 
    
    // DO NOT MODIFY BELOW THIS LINE
    const parsedUrl = url.parse(req.url, true);
    if (parsedUrl.pathname === '/set' && parsedUrl.query.key && parsedUrl.query.value) {
        res.end(`Session Updated: ${JSON.stringify(session)}`);
    } else {
        res.end(`Session Data: ${JSON.stringify(session)}`);
    }
});

// Conditionally start the server if this script is run directly
if (require.main === module) {
    server.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}

// For Plussa grader
module.exports = server;

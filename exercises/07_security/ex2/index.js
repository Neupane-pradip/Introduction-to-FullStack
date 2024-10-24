const http = require('http');
const port = 3000;
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // TODO 1: Define CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Methods': 'GET, POST, HEAD', // Only simple CORS request methods
    'Access-Control-Max-Age': '14400' // Cache CORS info for 4 hours (14400 seconds)
  };

  // TODO 2: Check Origin header
  if (!req.headers['origin']) {
    res.writeHead(400, headers);
    res.end('Origin header not in the request');
    return;
  }

  // Handle different HTTP methods
  switch (req.method) {
    // TODO 3: Handle GET and POST
    case 'GET':
    case 'POST':
      res.writeHead(200, headers);
      res.end('I was requested using CORS!');
      return;

    // TODO 4: Handle HEAD
    case 'HEAD':
      res.writeHead(200, headers);
      res.end();
      return;

    // TODO 5: Handle not allowed methods
    default:
      res.writeHead(405, headers);
      res.end('Request used a HTTP method which is not allowed.');
      return;
  }
});

// DO NOT MODIFY BELOW THIS LINE
module.exports = server;

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
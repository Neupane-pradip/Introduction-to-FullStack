const http = require('http');
const url = require('url');
const port = 3000;

const server = http.createServer((request, response) => {
  request.on('error', (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  
  response.on('error', (err) => {
    console.error(err);
  });

  const queryObject = url.parse(request.url, true).query;

  // Sanitize user input using encodeURIComponent to prevent XSS
  const sanitizedText = queryObject['addThisText'] ? 
    encodeURIComponent(queryObject['addThisText']) : '';

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(
    `<!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <title>XSS alert!</title>
    </head>
    <body>
        <p id="xss">Here be XSS! queryObject['addThisText'] is now: </p>
        ${sanitizedText}
    </body>
    </html>`
  );
  
  console.log("queryObject['addThisText']: ", queryObject['addThisText']);
  response.end();
});

// DO NOT MODIFY BELOW THIS LINE
module.exports = server;

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
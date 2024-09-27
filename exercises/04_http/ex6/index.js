const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {
  const urlPath = request.url; // Get the URL path

  if (urlPath === '/classical') {
    readFileSendResponse('homer.html', 'text/html', response);
  } else if (urlPath === '/dystopy') {
    readFileSendResponse('bradbury.html', 'text/html', response);
  } else if (urlPath === '/') {
    readFileSendResponse('index.html', 'text/html', response);
  } else {
    // Handle 404 error
    response.statusCode = 404;
    response.statusMessage = 'Requested content not found';
    response.write('<h1>404 - Requested content not found</h1>');
    response.end();
  }
}).listen(3000);

/* 
  * Function to read a file and send the response
  * @param {string} fileName - name of the file to be read
  * @param {string} contentType - type of the content to be sent in the response
  * @param {object} response - response object
  */
const readFileSendResponse = (fileName, contentType, response) => {
  fs.readFile(path.resolve(__dirname, fileName), function (error, file) {
    if (error) {
      response.writeHead(404);
      response.write('An error occurred: ' + error);
    } else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.write(file);
    }
    response.end();
  });
};

console.log('Server running at http://localhost:3000/');

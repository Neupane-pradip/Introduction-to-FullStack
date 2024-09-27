const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function (request, response) {

  const acceptHeader = request.headers['accept'];

  if (acceptHeader.includes('application/json')) {
    readFileSendResponse('data.json', 'application/json', response);
  } else if (acceptHeader.includes('application/xml')) {
    readFileSendResponse('data.xml', 'application/xml', response);
  } else if (acceptHeader.includes('text/html')) {
    readFileSendResponse('data.html', 'text/html', response);
  } else if (acceptHeader.includes('text/css')) {
    readFileSendResponse('data.css', 'text/css', response);
  } else if (acceptHeader.includes('application/zip')) {
    readFileSendResponse('data.zip', 'application/zip', response);
  } else if (acceptHeader.includes('text/plain') || acceptHeader.includes('*/*')) {
    readFileSendResponse('data.txt', 'text/plain', response);
  } else {
    response.statusCode = 406;
    response.statusMessage = 'Content type not available';
    response.end();
  }
}).listen(3000);

/* 
  * @param {string} fileName - name of the file to be read
  * @param {string} contentType - type of the content to be sent in the response
  * @param {object} response - response object
  */
const readFileSendResponse = (fileName, contentType, response) => {
  fs.readFile(path.resolve(fileName), function (error, file) {
    if (error) {
      response.writeHead(404);
      response.write('An error occured: ', error);
    } else {
      response.writeHead(200, { 'Content-Type': contentType });
      response.write(file);
    }
    response.end();
  })
}
const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer(function(request, response) {
  fs.readFile(path.resolve(__dirname, 'index.html'), function(error, htmlPage) {
    if (error) {
      response.writeHead(404);
      response.write('An error occured: ', error);
    } else {
      response.writeHead(202, { 'Content-Type': 'text/html'});
      response.write(htmlPage);
    }
    response.end();
  });
}).listen(3000);
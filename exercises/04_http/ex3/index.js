const http = require('http');

http.createServer((request, response) =>{

   // Set the response status code and content type
  response.writeHead(200, {'Content-Type':'text/html'});

  // Access the HTTP headers from the incoming request
  const headers =JSON.stringify(request.headers);

   // Write the headers to the response
   response.write(headers);

   //End the response
   response.end();

}).listen(3000, () =>{
  console.log('Server is listening on port 3000');
});








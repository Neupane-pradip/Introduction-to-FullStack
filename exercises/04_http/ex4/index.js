const http = require('http');

const server = http.createServer((req, res) => {
    let body = '';

    // Capture the data as it comes in
    req.on('data', chunk => {
        body += chunk.toString();
    });

    // When the data is fully received
    req.on('end', () => {
        // Reverse the body content
        const reversedBody = body.split('').reverse().join('');

        // Set the response headers and status code
        res.writeHead(200, { 'Content-Type': 'text/plain' });

        // Write the reversed body to the response
        res.write(reversedBody);

        // End the response
        res.end();
    });
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

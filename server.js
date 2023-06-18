// Imports the HTTP and URL modules
const http = require('http');
const url = require('url');

// Function from the HTTP module with two arguments
http.createServer((request, response) => {

  // Adds a header to the response that will be returned, along with the HTTP status code 200 for 'OK'
  response.writeHead(200, { 'Content-Type': 'text/plain' });

  // Ends the response by sending back the message 'Hello Node!'
  response.end('Hello Node!\n');

  // Listens for a response on port 8080
}).listen(8080);

console.log('My first Node test server is running on Port 8080.');

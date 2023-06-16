// Imports the HTTP module
const http = require('http');

// Function from the HTTP module with two arguments
http.createServer((request, response) => {

  // Adds a header to the response that will be returned, along with the HTTP status code 200 for 'OK'
  response.writeHead(200, { 'Content-Type': 'text/plain' });

  // Ends the response by sending back the message 'Hello Node!'
  response.end('Hello Node!\n');

  // Listens for a repsonse on port 8080ƒ
}).listen(8080)

console.log('My first Node test server is running on Port 8080.');

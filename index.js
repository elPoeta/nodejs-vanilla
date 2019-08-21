const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Response from vanilla nodejs server\n');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const stringQuery = parsedUrl.query;
  const headers = req.headers;

  res.end('Response from vanilla nodejs server\n');
  console.log(`URL: ${trimedPath} | Method: ${method} | Query: ${JSON.stringify(stringQuery)}`);
  console.log(`Headers: ${JSON.stringify(headers)}`);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
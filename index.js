const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const handlerRoute = require('./routes');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const stringQuery = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();
    let data = {
      trimedPath,
      method
    }

    handlerRoute(trimedPath, (statusCode, payload) => {
      data = { ...data, statusCode, payload };
      console.log("data object : ", data);
      console.log(`Status: ${statusCode} | Payload: ${JSON.stringify(payload)}`);
    })();

    res.setHeader('Content-type', 'application/json');
    res.writeHead(data.statusCode);
    const payload = JSON.stringify(data.payload);
    res.end(payload);
    console.log(`URL: ${trimedPath} | Method: ${method} | Query: ${JSON.stringify(stringQuery)}`);
    console.log(`Headers: ${JSON.stringify(headers)}`);
    console.log(`Buffer: ${buffer}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});
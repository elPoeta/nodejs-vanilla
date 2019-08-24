const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const { StringDecoder } = require('string_decoder');
const config = require('./config/config');
const router = require('./routes/router');
const { parseJsonObject } = require('./lib/helpers');

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
  console.log(`Server listen on port ${config.httpPort}`);
});

const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(`Server listen on port ${config.httpsPort}`);
});


const unifiedServer = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const query = parsedUrl.query;
  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();
    console.log('bodyparser :: ', JSON.parse(buffer));
    let data = {
      trimedPath,
      query,
      method,
      headers,
      payload: parseJsonObject(buffer)
    }

    router(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      payload = typeof (payload) == 'object' ? payload : {};
      // data = { ...data, statusCode, payload };
      // console.log("data object : ", data);
      console.log(`Status: ${statusCode} | Payload: ${JSON.stringify(payload)}`);
      res.setHeader('Content-type', 'application/json');
      res.writeHead(statusCode);
      const payloadString = JSON.stringify(payload);
      res.end(payloadString);
    })();
    console.log(`URL: ${trimedPath} | Method: ${method} | Query: ${JSON.stringify(query)}`);
    console.log(`Headers: ${JSON.stringify(headers)}`);
    console.log(`Buffer: ${buffer}`);
  });
}
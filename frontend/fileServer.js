const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');

const apiProxy = httpProxy.createProxyServer();
const app = express();

app.all("/api/*", (req, res) => {
  // service1
  console.log(req.path)
  apiProxy.web(req, res, {
    target: 'http://localhost:4000',
  });
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(5000);

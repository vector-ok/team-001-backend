const http = require('http');
// const app = require('./app');

const server = http.createServer((req, res) => {
  res.end('All good. Local server is up and running!');
});

server.listen(process.env.PORT || 4000);

const http = require('http');

let requestCount = 0;

const server = http.createServer((req, res) => {
  if (req.url === '/ping-pong') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`pong ${requestCount}`);
    requestCount++;
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const http = require('http');
const { v4: uuidv4 } = require('uuid');

const uniqueId = uuidv4();
let latestTimestamp = new Date().toISOString();

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Log Output app is running\n');
  } else if (req.url === '/log-status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ timestamp: latestTimestamp, uuid: uniqueId }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(() => {
  latestTimestamp = new Date().toISOString();
  console.log(`${latestTimestamp}: ${uniqueId}`);
}, 5000);
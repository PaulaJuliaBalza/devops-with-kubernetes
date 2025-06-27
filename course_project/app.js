const http = require('http');

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Todo App Running\n');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Todo App heartbeat on port ${PORT}`);
  }, 5000);
});
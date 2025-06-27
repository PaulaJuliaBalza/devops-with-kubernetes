const http = require('http');

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Todo App</title>
        </head>
        <body>
          <h1>Todo App</h1>
          <p>This is a simple todo application.</p>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
  }
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] Todo App heartbeat on port ${PORT}`);
  }, 5000);
});
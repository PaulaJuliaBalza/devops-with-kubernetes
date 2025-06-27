const { v4: uuidv4 } = require('uuid');

const uniqueId = uuidv4();

setInterval(() => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${uniqueId}`);
}, 5000);
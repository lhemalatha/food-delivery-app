const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Test OK - Backend is working!');
});

app.listen(5000, () => {
  console.log('Test server running on http://localhost:5000');
});

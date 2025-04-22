// config/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'lhema2711', // Your MySQL password
  database: 'food_delivery', // replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

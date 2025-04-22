const express = require('express');
const app = express();
const pool = require('./config/db');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../food-delivery-frontend')));

// API routes
app.use('/api', apiRoutes);

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../food-delivery-frontend/index.html'));
});

// Test database connection and start the server
async function testConnection() {
  try {
    // Test if database connection works
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database');
    connection.release();

    // Create tables if they don't exist
    const fs = require('fs');
    const sqlScript = fs.readFileSync(path.join(__dirname, 'models/tables.sql'), 'utf8');
    const statements = sqlScript.split(';').filter(stmt => stmt.trim());
    
    for (let statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    console.log('Database tables created/verified successfully');

    // Start the server after the database connection is successful
    const server = app.listen(5001, () => {
      console.log('Server running at http://localhost:5001');
      console.log('Frontend files being served from:', path.join(__dirname, '../food-delivery-frontend'));
    });

  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Call the function to test the connection and start the server
testConnection();



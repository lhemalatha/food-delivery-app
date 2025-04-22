const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/config');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn
  });
};

module.exports = {
  // User Registration
  register: async (req, res) => {
    try {
      const { username, email, password, phone, address } = req.body;

      // Check if user already exists
      const [existingUser] = await db.query(
        'SELECT * FROM users WHERE email = ? OR username = ?', 
        [email, username]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ 
          message: 'User already exists with this email or username' 
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(config.auth.saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const [result] = await db.query(
        'INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, phone, address]
      );

      // Generate token
      const token = generateToken(result.insertId);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: result.insertId,
          username,
          email,
          phone,
          address
        }
      });

    } catch (error) {
      res.status(500).json({ 
        message: 'Error registering user',
        error: error.message 
      });
    }
  },

  // User Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const [users] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = users[0];

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user.id);

      // Don't send password back
      delete user.password;

      res.json({
        success: true,
        token,
        user
      });

    } catch (error) {
      res.status(500).json({ 
        message: 'Error logging in',
        error: error.message 
      });
    }
  },

  // Get Current User Profile
  getMe: async (req, res) => {
    try {
      const [users] = await db.query(
        'SELECT id, username, email, phone, address, created_at FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        success: true,
        user: users[0]
      });

    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching user profile',
        error: error.message 
      });
    }
  },

  // Update User Profile
  updateProfile: async (req, res) => {
    try {
      const { username, phone, address } = req.body;
      const userId = req.user.id;

      await db.query(
        'UPDATE users SET username = ?, phone = ?, address = ? WHERE id = ?',
        [username, phone, address, userId]
      );

      // Fetch updated user
      const [users] = await db.query(
        'SELECT id, username, email, phone, address FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        success: true,
        user: users[0]
      });

    } catch (error) {
      res.status(500).json({ 
        message: 'Error updating profile',
        error: error.message 
      });
    }
  },

  // Change Password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Get current password hash
      const [users] = await db.query(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, users[0].password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(config.auth.saltRounds);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      await db.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [newHashedPassword, userId]
      );

      res.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
      res.status(500).json({ 
        message: 'Error changing password',
        error: error.message 
      });
    }
  }
};
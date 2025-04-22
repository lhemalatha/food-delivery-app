const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all menu items
router.get('/menu', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM menu_items');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Error fetching menu items' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Get all order items
router.get('/order-items', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM order_items');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching order items:', error);
        res.status(500).json({ error: 'Error fetching order items' });
    }
});

// Create a new user (signup)
router.post('/users', async (req, res) => {
    try {
        console.log('Received user data:', req.body);
        const { name, email, phone, address } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !address) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['name', 'email', 'phone', 'address'],
                received: req.body 
            });
        }

        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            // If user exists, return their ID instead of creating a new one
            return res.status(200).json({ 
                id: existingUsers[0].id, 
                message: 'User already exists' 
            });
        }

        // Create new user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, phone, address) VALUES (?, ?, ?, ?)',
            [name, email, phone, address]
        );

        res.status(201).json({ 
            id: result.insertId, 
            message: 'User created successfully' 
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ 
            error: 'Error creating user', 
            details: error.message 
        });
    }
});

// Create a new order
router.post('/orders', async (req, res) => {
    try {
        console.log('Received order data:', req.body);
        const { user_id, items, total_amount, delivery_address } = req.body;

        // Validate required fields
        if (!user_id || !items || !delivery_address) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['user_id', 'items', 'delivery_address'],
                received: req.body 
            });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create order
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total_amount, delivery_address) VALUES (?, ?, ?)',
                [user_id, total_amount || 0, delivery_address]
            );
            const orderId = orderResult.insertId;

            // Create order items
            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.menu_item_id || 1, item.quantity, item.price || 0]
                );
            }

            await connection.commit();
            res.status(201).json({ 
                id: orderId, 
                message: 'Order created successfully' 
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: 'Error creating order', 
            details: error.message 
        });
    }
});

// Get user orders
router.get('/users/:userId/orders', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT o.*, oi.menu_item_id, oi.quantity, oi.price, mi.name as item_name 
             FROM orders o 
             JOIN order_items oi ON o.id = oi.order_id 
             JOIN menu_items mi ON oi.menu_item_id = mi.id 
             WHERE o.user_id = ?`,
            [req.params.userId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ 
            error: 'Error fetching orders',
            details: error.message 
        });
    }
});

module.exports = router; 
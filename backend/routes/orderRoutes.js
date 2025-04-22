const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// Routes

// Place a new order (protected)
router.post('/', protect, orderController.placeOrder);

// Get all orders of the logged-in user (protected)
router.get('/my-orders', protect, orderController.getMyOrders);

// Admin: Get all orders (optional: add admin middleware if needed)
router.get('/', protect, orderController.getAllOrders);

// Get order by ID (protected)
router.get('/:id', protect, orderController.getOrderById);

// Update order status (admin or delivery person functionality)
router.put('/:id/status', protect, orderController.updateOrderStatus);

// Delete an order (if applicable)
router.delete('/:id', protect, orderController.deleteOrder);

module.exports = router;

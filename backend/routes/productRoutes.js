const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticate, authorize('admin'), upload.single('image'), productController.createProduct);
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticate, authorize('admin'), productController.deleteProduct);

module.exports = router;
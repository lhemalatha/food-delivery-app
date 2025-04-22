const db = require('../config/db');
const { validationResult } = require('express-validator');

module.exports = {
  // @desc    Create a new review
  // @route   POST /api/reviews
  // @access  Private
  createReview: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { product_id, rating, comment } = req.body;
      const user_id = req.user.id; // From auth middleware

      // Check if product exists
      const [product] = await db.query(
        'SELECT id FROM products WHERE id = ?',
        [product_id]
      );
      if (product.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if user already reviewed this product
      const [existingReview] = await db.query(
        'SELECT id FROM reviews WHERE user_id = ? AND product_id = ?',
        [user_id, product_id]
      );

      if (existingReview.length > 0) {
        return res.status(400).json({ 
          message: 'You have already reviewed this product' 
        });
      }

      // Create review
      const [result] = await db.query(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
        [user_id, product_id, rating, comment]
      );

      // Update product average rating
      await updateProductRating(product_id);

      // Get the full review details with user info
      const [newReview] = await db.query(
        `SELECT r.*, u.username, u.email 
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [result.insertId]
      );

      res.status(201).json({
        success: true,
        review: newReview[0]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Server error creating review',
        error: error.message 
      });
    }
  },

  // @desc    Get reviews for a product
  // @route   GET /api/reviews/product/:productId
  // @access  Public
  getProductReviews: async (req, res) => {
    try {
      const { productId } = req.params;

      // Check if product exists
      const [product] = await db.query(
        'SELECT id FROM products WHERE id = ?',
        [productId]
      );
      if (product.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Get reviews with user details
      const [reviews] = await db.query(
        `SELECT r.*, u.username, u.email 
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.product_id = ?
         ORDER BY r.created_at DESC`,
        [productId]
      );

      res.json({
        success: true,
        count: reviews.length,
        reviews
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Server error fetching reviews',
        error: error.message 
      });
    }
  },

  // @desc    Update a review
  // @route   PUT /api/reviews/:id
  // @access  Private (only review owner or admin)
  updateReview: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const user_id = req.user.id;

      // Check if review exists and belongs to user
      const [review] = await db.query(
        'SELECT * FROM reviews WHERE id = ?',
        [id]
      );

      if (review.length === 0) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review[0].user_id !== user_id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          message: 'Not authorized to update this review' 
        });
      }

      // Update review
      await db.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment, id]
      );

      // Update product average rating
      await updateProductRating(review[0].product_id);

      // Get updated review
      const [updatedReview] = await db.query(
        `SELECT r.*, u.username, u.email 
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [id]
      );

      res.json({
        success: true,
        review: updatedReview[0]
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Server error updating review',
        error: error.message 
      });
    }
  },

  // @desc    Delete a review
  // @route   DELETE /api/reviews/:id
  // @access  Private (only review owner or admin)
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      // Check if review exists and belongs to user
      const [review] = await db.query(
        'SELECT * FROM reviews WHERE id = ?',
        [id]
      );

      if (review.length === 0) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review[0].user_id !== user_id && req.user.role !== 'admin') {
        return res.status(403).json({ 
          message: 'Not authorized to delete this review' 
        });
      }

      const product_id = review[0].product_id;

      // Delete review
      await db.query('DELETE FROM reviews WHERE id = ?', [id]);

      // Update product average rating
      await updateProductRating(product_id);

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: 'Server error deleting review',
        error: error.message 
      });
    }
  }
};

// Helper function to update product average rating
async function updateProductRating(productId) {
  try {
    // Calculate new average rating
    const [result] = await db.query(
      'SELECT AVG(rating) as averageRating FROM reviews WHERE product_id = ?',
      [productId]
    );

    const averageRating = result[0].averageRating || 0;

    // Update product
    await db.query(
      'UPDATE products SET rating = ? WHERE id = ?',
      [averageRating, productId]
    );

  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}
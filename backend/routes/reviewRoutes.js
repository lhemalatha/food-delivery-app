const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const {
  createReviewSchema,
  updateReviewSchema
} = require('../validations/reviewValidations');

// Create a review
router.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);

// Get product reviews
router.get('/product/:productId', reviewController.getProductReviews);

// Update a review
router.put('/:id', authenticate, validate(updateReviewSchema), reviewController.updateReview);

// Delete a review
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router;
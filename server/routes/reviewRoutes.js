const express = require('express');
const { body } = require('express-validator');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const reviewValidation = [
  body('provider')
    .notEmpty()
    .withMessage('Provider is required')
    .isMongoId()
    .withMessage('Invalid provider ID'),
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
  body('anonymous').optional().isBoolean().withMessage('Anonymous must be a boolean'),
];

// Public routes
router.route('/').get(getReviews);
router.route('/:id').get(getReview);

// Protected routes
router.use(protect);

router.post('/', reviewValidation, createReview);
router.put('/:id', reviewValidation, updateReview);
router.delete('/:id', deleteReview);

module.exports = router;

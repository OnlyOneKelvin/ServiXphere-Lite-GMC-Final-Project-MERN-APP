const express = require('express');
const { body } = require('express-validator');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation rules
const bookingValidation = [
  body('provider')
    .notEmpty()
    .withMessage('Provider is required')
    .isMongoId()
    .withMessage('Invalid provider ID'),
  body('service')
    .notEmpty()
    .withMessage('Service is required')
    .isMongoId()
    .withMessage('Invalid service ID'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date format'),
  body('status')
    .optional()
    .isIn(['pending', 'completed', 'cancelled'])
    .withMessage('Status must be pending, completed, or cancelled'),
];

router.route('/').get(getBookings).post(bookingValidation, createBooking);
router.route('/:id').get(getBooking).put(bookingValidation, updateBooking).delete(deleteBooking);

module.exports = router;

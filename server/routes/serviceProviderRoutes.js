const express = require('express');
const { body } = require('express-validator');
const {
  getProviders,
  getProvider,
  createProvider,
  updateProvider,
  deleteProvider,
} = require('../controllers/serviceProviderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const providerValidation = [
  body('name').trim().notEmpty().withMessage('Provider name is required'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('servicesOffered')
    .optional()
    .isArray()
    .withMessage('Services offered must be an array'),
  body('servicesOffered.*')
    .optional()
    .isMongoId()
    .withMessage('Invalid service ID'),
];

// Public routes
router.route('/').get(getProviders);
router.route('/:id').get(getProvider);

// Protected routes
router.use(protect);

router.post('/', authorize('admin'), providerValidation, createProvider);
router.put('/:id', authorize('admin', 'provider'), providerValidation, updateProvider);
router.delete('/:id', authorize('admin'), deleteProvider);

module.exports = router;

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

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', providerValidation, createProvider);
router.put('/:id', providerValidation, updateProvider);
router.delete('/:id', deleteProvider);

module.exports = router;

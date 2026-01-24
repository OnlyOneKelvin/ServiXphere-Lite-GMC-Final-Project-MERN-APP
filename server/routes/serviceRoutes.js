const express = require('express');
const { body } = require('express-validator');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

// Public routes
router.route('/').get(getServices);
router.route('/:id').get(getService);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', serviceValidation, createService);
router.put('/:id', serviceValidation, updateService);
router.delete('/:id', deleteService);

module.exports = router;

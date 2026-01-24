const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/serviceCategoryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
];

// Public routes
router.route('/').get(getCategories);
router.route('/:id').get(getCategory);

// Protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', categoryValidation, createCategory);
router.put('/:id', categoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

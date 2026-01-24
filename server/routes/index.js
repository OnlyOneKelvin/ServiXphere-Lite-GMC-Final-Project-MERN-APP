const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const serviceCategoryRoutes = require('./serviceCategoryRoutes');
const serviceRoutes = require('./serviceRoutes');
const serviceProviderRoutes = require('./serviceProviderRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', serviceCategoryRoutes);
router.use('/services', serviceRoutes);
router.use('/providers', serviceProviderRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;

const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let query = {};

    // Users can only see their own bookings, admins can see all, providers see bookings to them
    if (req.user.role === 'provider') {
      const provider = await ServiceProvider.findOne({ user: req.user.id });
      if (provider) {
        query.provider = provider._id;
      } else {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
    } else if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('provider', 'name phone location averageRating')
      .populate('service', 'name description price')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role === 'provider') {
      const provider = await ServiceProvider.findOne({ user: req.user.id });
      if (provider) {
        query.provider = provider._id;
      }
    } else if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const booking = await Booking.findOne(query)
      .populate('user', 'name email')
      .populate('provider', 'name phone location averageRating')
      .populate('service', 'name description price');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create booking (with wallet deduction)
// @route   POST /api/v1/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Verify provider exists
    const provider = await ServiceProvider.findById(req.body.provider);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found',
      });
    }

    // Verify service exists
    const service = await Service.findById(req.body.service);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    // Verify provider offers this service
    if (!provider.servicesOffered.includes(req.body.service)) {
      return res.status(400).json({
        success: false,
        message: 'Provider does not offer this service',
      });
    }

    const servicePrice = service.price || 0;

    // If service has a price, check wallet and deduct
    if (servicePrice > 0) {
      const user = await User.findById(req.user.id);
      const currentBalance = user.walletBalance || 0;

      if (currentBalance < servicePrice) {
        return res.status(400).json({
          success: false,
          message: `Insufficient wallet balance. Service costs ₦${servicePrice.toLocaleString()} but your balance is ₦${currentBalance.toLocaleString()}. Please top up your wallet.`,
        });
      }

      // Deduct from wallet
      user.walletBalance = currentBalance - servicePrice;
      await user.save();

      // Log the payment transaction
      await Transaction.create({
        user: user._id,
        amount: servicePrice,
        type: 'payment',
        status: 'success',
        reference: 'booking_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      });
    }

    const booking = await Booking.create({
      ...req.body,
      user: req.user.id,
      amount: servicePrice,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('provider', 'name phone location averageRating')
      .populate('service', 'name description price');

    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let query = { _id: req.params.id };

    if (req.user.role === 'provider') {
      const provider = await ServiceProvider.findOne({ user: req.user.id });
      if (provider) {
        query.provider = provider._id;
      }
    } else if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    let booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Don't allow updating user field
    const updateData = { ...req.body };
    delete updateData.user;

    booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('user', 'name email')
      .populate('provider', 'name phone location averageRating')
      .populate('service', 'name description');

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.role === 'provider') {
      const provider = await ServiceProvider.findOne({ user: req.user.id });
      if (provider) {
        query.provider = provider._id;
      }
    } else if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

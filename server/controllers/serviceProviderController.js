const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');
const { validationResult } = require('express-validator');

// @desc    Get all providers
// @route   GET /api/v1/providers
// @access  Public
exports.getProviders = async (req, res, next) => {
  try {
    let query = {};

    // Filter by service if provided
    if (req.query.service) {
      query.servicesOffered = req.query.service;
    }

    // Filter by user (so a logged in provider can find their own profile)
    if (req.query.user) {
      query.user = req.query.user;
    }

    const providers = await ServiceProvider.find(query)
      .populate('servicesOffered', 'name description category')
      .sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      count: providers.length,
      data: providers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single provider
// @route   GET /api/v1/providers/:id
// @access  Public
exports.getProvider = async (req, res, next) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id).populate(
      'servicesOffered',
      'name description category'
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found',
      });
    }

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create provider
// @route   POST /api/v1/providers
// @access  Private/Admin
exports.createProvider = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Verify services exist if provided
    if (req.body.servicesOffered && req.body.servicesOffered.length > 0) {
      const services = await Service.find({
        _id: { $in: req.body.servicesOffered },
      });
      if (services.length !== req.body.servicesOffered.length) {
        return res.status(404).json({
          success: false,
          message: 'One or more services not found',
        });
      }
    }

    const provider = await ServiceProvider.create(req.body);

    const populatedProvider = await ServiceProvider.findById(provider._id).populate(
      'servicesOffered',
      'name description category'
    );

    res.status(201).json({
      success: true,
      data: populatedProvider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update provider
// @route   PUT /api/v1/providers/:id
// @access  Private/Admin or Provider
exports.updateProvider = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let provider = await ServiceProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found',
      });
    }

    // Make sure user is admin or is updating their own provider profile
    if (req.user.role !== 'admin') {
      if (provider.user && provider.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this provider profile',
        });
      }
    }

    // Verify services exist if updating services
    if (req.body.servicesOffered && req.body.servicesOffered.length > 0) {
      const services = await Service.find({
        _id: { $in: req.body.servicesOffered },
      });
      if (services.length !== req.body.servicesOffered.length) {
        return res.status(404).json({
          success: false,
          message: 'One or more services not found',
        });
      }
    }

    provider = await ServiceProvider.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('servicesOffered', 'name description category');

    res.status(200).json({
      success: true,
      data: provider,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete provider
// @route   DELETE /api/v1/providers/:id
// @access  Private/Admin
exports.deleteProvider = async (req, res, next) => {
  try {
    const provider = await ServiceProvider.findById(req.params.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found',
      });
    }

    await provider.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const Review = require('../models/Review');
const ServiceProvider = require('../models/ServiceProvider');
const { validationResult } = require('express-validator');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    let query = {};

    // Filter by provider if provided
    if (req.query.provider) {
      query.provider = req.query.provider;
    }

    const reviews = await Review.find(query)
      .populate('provider', 'name location averageRating')
      .sort({ createdAt: -1 });

    // Remove user info if anonymous
    const sanitizedReviews = reviews.map((review) => {
      const reviewObj = review.toObject();
      if (review.anonymous) {
        delete reviewObj.user;
      }
      return reviewObj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedReviews.length,
      data: sanitizedReviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      'provider',
      'name location averageRating'
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const reviewObj = review.toObject();
    // Remove user info if anonymous
    if (review.anonymous) {
      delete reviewObj.user;
    }

    res.status(200).json({
      success: true,
      data: reviewObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
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

    const review = await Review.create({
      ...req.body,
      anonymous: req.body.anonymous !== undefined ? req.body.anonymous : true,
    });

    // Update provider's average rating
    const reviews = await Review.find({ provider: req.body.provider });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    await ServiceProvider.findByIdAndUpdate(req.body.provider, {
      averageRating: averageRating,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'provider',
      'name location averageRating'
    );

    const reviewObj = populatedReview.toObject();
    // Remove user info if anonymous
    if (populatedReview.anonymous) {
      delete reviewObj.user;
    }

    res.status(201).json({
      success: true,
      data: reviewObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('provider', 'name location averageRating');

    // Update provider's average rating
    const reviews = await Review.find({ provider: review.provider._id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));

    await ServiceProvider.findByIdAndUpdate(review.provider._id, {
      averageRating: averageRating,
    });

    const reviewObj = review.toObject();
    // Remove user info if anonymous
    if (review.anonymous) {
      delete reviewObj.user;
    }

    res.status(200).json({
      success: true,
      data: reviewObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const providerId = review.provider;

    await review.deleteOne();

    // Update provider's average rating
    const reviews = await Review.find({ provider: providerId });
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    }

    await ServiceProvider.findByIdAndUpdate(providerId, {
      averageRating: averageRating,
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

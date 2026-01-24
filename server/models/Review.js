const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceProvider',
      required: [true, 'Please provide a service provider'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
    anonymous: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update provider's average rating when a review is saved
reviewSchema.post('save', async function () {
  const ServiceProvider = mongoose.model('ServiceProvider');
  const reviews = await mongoose.model('Review').find({ provider: this.provider });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    
    await ServiceProvider.findByIdAndUpdate(this.provider, {
      averageRating: averageRating,
    });
  }
});

// Update provider's average rating when a review is deleted
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const ServiceProvider = mongoose.model('ServiceProvider');
    const reviews = await mongoose.model('Review').find({ provider: doc.provider });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
      
      await ServiceProvider.findByIdAndUpdate(doc.provider, {
        averageRating: averageRating,
      });
    } else {
      await ServiceProvider.findByIdAndUpdate(doc.provider, {
        averageRating: 0,
      });
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);

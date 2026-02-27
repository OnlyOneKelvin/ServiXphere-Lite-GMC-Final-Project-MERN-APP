import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { providerAPI, reviewAPI, bookingAPI, walletAPI } from '../api/services';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
  });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    anonymous: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [providerRes, reviewsRes] = await Promise.all([
          providerAPI.getById(id),
          reviewAPI.getAll(id),
        ]);

        if (providerRes.success) {
          setProvider(providerRes.data);
        }
        if (reviewsRes.success) {
          setReviews(reviewsRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load provider');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch wallet balance for authenticated users
  useEffect(() => {
    const fetchWallet = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await walletAPI.getBalance();
        if (res.success) setWalletBalance(res.data.balance);
      } catch (e) { /* ignore */ }
    };
    fetchWallet();
  }, [isAuthenticated]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await bookingAPI.create({
        provider: id,
        service: bookingData.service,
        date: bookingData.date,
      });

      if (response.success) {
        setSuccess('Booking created successfully! Wallet has been charged.');
        setShowBookingForm(false);
        setBookingData({ service: '', date: '' });
        // Refresh wallet balance
        try {
          const walletRes = await walletAPI.getBalance();
          if (walletRes.success) setWalletBalance(walletRes.data.balance);
        } catch (e) { /* ignore */ }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await reviewAPI.create({
        provider: id,
        ...reviewData,
      });

      if (response.success) {
        setSuccess('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewData({ rating: 5, comment: '', anonymous: true });
        // Refresh reviews
        const reviewsRes = await reviewAPI.getAll(id);
        if (reviewsRes.success) {
          setReviews(reviewsRes.data);
        }
        // Refresh provider to get updated rating
        const providerRes = await providerAPI.getById(id);
        if (providerRes.success) {
          setProvider(providerRes.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper: render filled/empty stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
      </svg>
    ));
  };

  // Helper: get reviewer display name
  const getReviewerName = (review) => {
    if (review.anonymous) return 'Anonymous';
    if (review.user?.name) {
      const parts = review.user.name.split(' ');
      if (parts.length > 1) {
        return `${parts[0]} ${parts[parts.length - 1][0]}.`;
      }
      return parts[0];
    }
    return 'User';
  };

  // Helper: get reviewer initials
  const getReviewerInitials = (review) => {
    if (review.anonymous) return 'A';
    if (review.user?.name) {
      return review.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  };

  if (loading) return <Loading />;
  if (!provider) return <div>Provider not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link — proper SVG chevron */}
        <Link
          to="/providers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Providers
        </Link>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Provider Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6">
          {/* Name + Rating grouped together */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{provider.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {renderStars(Math.round(provider.averageRating || 0))}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {provider.averageRating > 0 ? provider.averageRating.toFixed(1) : '—'}
              </span>
              <span className="text-sm text-gray-400">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Location & Phone stacked below */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {provider.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {provider.phone}
              </div>
            </div>
          </div>

          {/* Services Offered */}
          {provider.servicesOffered && provider.servicesOffered.length > 0 && (
            <div className="mb-6 pt-5 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {provider.servicesOffered.map((service) => (
                  <span
                    key={service._id}
                    className="bg-purple-50 text-purple-700 text-sm px-3 py-1 rounded-full font-medium"
                  >
                    {service.name}{service.price > 0 ? ` — ₦${service.price.toLocaleString()}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons — clear hierarchy */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
              {/* Primary CTA */}
              <button
                onClick={() => { setShowBookingForm(!showBookingForm); setShowReviewForm(false); }}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow-sm"
              >
                {showBookingForm ? 'Cancel' : 'Book Service'}
              </button>
              {/* Secondary CTA — ghost button */}
              <button
                onClick={() => { setShowReviewForm(!showReviewForm); setShowBookingForm(false); }}
                className="border border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600 text-sm font-medium px-5 py-2.5 rounded-lg transition"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="pt-5 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign in
                </Link>{' '}
                to book services or write reviews.
              </p>
            </div>
          )}
        </div>

        {/* Booking Form */}
        {showBookingForm && isAuthenticated && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Book a Service</h2>
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Service
                </label>
                <select
                  value={bookingData.service}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, service: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a service...</option>
                  {provider.servicesOffered?.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}{service.price > 0 ? ` — ₦${service.price.toLocaleString()}` : ' — Free'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, date: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Wallet balance summary */}
              {bookingData.service && (() => {
                const selectedService = provider.servicesOffered?.find(s => s._id === bookingData.service);
                const price = selectedService?.price || 0;
                const insufficient = price > 0 && walletBalance < price;
                return (
                  <div className={`mb-5 p-4 rounded-xl border text-sm ${insufficient ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Service Cost</span>
                      <span className="font-semibold text-gray-900">₦{price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wallet Balance</span>
                      <span className={`font-semibold ${insufficient ? 'text-red-600' : 'text-green-600'}`}>₦{walletBalance.toLocaleString()}</span>
                    </div>
                    {insufficient && (
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-red-600 text-xs font-medium">Insufficient balance</p>
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard')}
                          className="text-xs text-purple-600 font-semibold hover:underline"
                        >
                          Top up wallet →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && isAuthenticated && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Write a Review</h2>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rating
                </label>
                <select
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, rating: parseInt(e.target.value) })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Star' : 'Stars'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Review
                </label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  rows="3"
                  placeholder="Share your experience..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="mb-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewData.anonymous}
                    onChange={(e) =>
                      setReviewData({ ...reviewData, anonymous: e.target.checked })
                    }
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-600">Submit anonymously</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
            <span className="text-sm text-gray-400">{reviews.length} total</span>
          </div>
          {reviews.length > 0 ? (
            <div className="space-y-0">
              {reviews.map((review, index) => (
                <div
                  key={review._id}
                  className={`py-4 ${index < reviews.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Reviewer info + stars + date — all grouped */}
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                      {getReviewerInitials(review)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {getReviewerName(review)}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-10 h-10 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm text-gray-400">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;

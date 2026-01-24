import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { providerAPI, reviewAPI, bookingAPI } from '../api/services';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const ProviderProfile = () => {
  const { id } = useParams();
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
        setSuccess('Booking created successfully!');
        setShowBookingForm(false);
        setBookingData({ service: '', date: '' });
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

  if (loading) return <Loading />;
  if (!provider) return <div>Provider not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/providers" className="text-purple-600 hover:text-purple-800 mb-4 inline-block">
        ← Back to Providers
      </Link>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{provider.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              <span className="font-medium">Location:</span> {provider.location}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {provider.phone}
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Average Rating:</span>{' '}
              <span className="text-yellow-500 font-semibold text-xl">
                {provider.averageRating > 0
                  ? `${provider.averageRating} ⭐`
                  : 'No ratings yet'}
              </span>
            </p>
          </div>
        </div>

        {provider.servicesOffered && provider.servicesOffered.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Services Offered</h2>
            <div className="flex flex-wrap gap-2">
              {provider.servicesOffered.map((service) => (
                <span
                  key={service._id}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
            >
              {showBookingForm ? 'Cancel Booking' : 'Book Service'}
            </button>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
            >
              {showReviewForm ? 'Cancel Review' : 'Write Review'}
            </button>
          </div>
        )}

        {!isAuthenticated && (
          <p className="text-gray-600 mt-4">
            <Link to="/login" className="text-purple-600 hover:text-purple-800">
              Login
            </Link>{' '}
            to book services or write reviews
          </p>
        )}
      </div>

      {showBookingForm && isAuthenticated && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Book Service</h2>
          <form onSubmit={handleBookingSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <select
                value={bookingData.service}
                onChange={(e) =>
                  setBookingData({ ...bookingData, service: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a service...</option>
                {provider.servicesOffered?.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
            >
              {submitting ? 'Booking...' : 'Create Booking'}
            </button>
          </form>
        </div>
      )}

      {showReviewForm && isAuthenticated && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Write Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={reviewData.rating}
                onChange={(e) =>
                  setReviewData({ ...reviewData, rating: parseInt(e.target.value) })
                }
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Star' : 'Stars'}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({ ...reviewData, comment: e.target.value })
                }
                rows="4"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reviewData.anonymous}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, anonymous: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Submit anonymously</span>
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-yellow-500 font-semibold">
                      {'⭐'.repeat(review.rating)}
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;

import { useState, useEffect } from 'react';
import { bookingAPI } from '../api/services';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getAll(filterStatus || null);
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await bookingAPI.update(bookingId, { status: newStatus });
      if (response.success) {
        fetchBookings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await bookingAPI.delete(bookingId);
      if (response.success) {
        fetchBookings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {error && <Alert type="error" message={error} />}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {booking.service?.name || 'Service'}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Provider:</span>{' '}
                    {booking.provider?.name || 'N/A'}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Date:</span>{' '}
                    {new Date(booking.date).toLocaleString()}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Location:</span>{' '}
                    {booking.provider?.location || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Phone:</span>{' '}
                    {booking.provider?.phone || 'N/A'}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'completed')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition text-sm"
                    >
                      Mark Complete
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No bookings found.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;

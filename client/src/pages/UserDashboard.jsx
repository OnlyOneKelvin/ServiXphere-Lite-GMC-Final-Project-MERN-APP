import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI, walletAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  // Wallet State
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [filterStatus]);

  // Close kebab menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, walletRes] = await Promise.all([
        bookingAPI.getAll(filterStatus || null),
        walletAPI.getBalance()
      ]);

      if (bookingsRes.success) {
        setBookings(bookingsRes.data);
      }
      if (walletRes.success) {
        setWalletBalance(walletRes.data.balance);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll(filterStatus || null);
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    }
  };

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    if (!topUpAmount || topUpAmount < 100) {
      setError('Minimum top-up amount is ₦100');
      return;
    }

    try {
      setTopUpLoading(true);
      setError(null);
      const response = await walletAPI.initializePayment(Number(topUpAmount));

      if (response.success && response.data.reference) {
        setShowTopUpModal(false);
        // Use React Router navigation instead of full page redirect
        navigate(`/mock-payment?reference=${response.data.reference}&amount=${topUpAmount}`);
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setTopUpLoading(false);
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
    if (!window.confirm('Are you sure you want to delete this booking? This cannot be undone.')) {
      return;
    }
    try {
      const response = await bookingAPI.delete(bookingId);
      if (response.success) {
        setOpenMenuId(null);
        fetchBookings();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete booking');
    }
  };

  // Format date human-readable: "Feb 17, 2026 at 6:47 PM"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Status badge config
  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Completed',
          classes: 'bg-green-50 text-green-700 border border-green-200',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          classes: 'bg-red-50 text-red-700 border border-red-200',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      default:
        return {
          label: 'Pending',
          classes: 'bg-amber-50 text-amber-700 border border-amber-200',
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Card / Header */}
        <div className="flex items-center gap-4 mb-5 mt-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
            <span className="font-bold text-xl text-purple-600">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{user?.name || 'User Name'}</h1>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <span>{user?.email || 'user@example.com'}</span>
              <svg className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-purple-600 transition-colors align-baseline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="rounded-[24px] p-6 mb-10 relative overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #1C1A1D 0%, #2A1F3D 50%, #1C1A1D 100%)' }}>
          {/* Decorative background shapes */}
          <div className="absolute -right-16 -top-16 w-64 h-64 border-[1px] border-white/[0.07] rounded-full" />
          <div className="absolute -right-8 -top-8 w-48 h-48 border-[1px] border-white/[0.07] rounded-full" />
          <div className="absolute -right-2 -top-2 w-32 h-32 border-[1px] border-white/[0.04] rounded-full" />
          {/* Subtle gradient mesh blobs */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <p className="text-gray-400 text-sm font-medium mb-3">{user?.name || 'User Name'}</p>

            {/* Balance + Eye toggle grouped inline */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-[34px] font-black text-white tracking-tight leading-none">
                {showBalance ? `₦${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '₦ * * *'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white transition p-1 mt-1"
                aria-label="Toggle balance visibility"
              >
                {showBalance ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <button className="flex items-center gap-1 text-[14px] font-medium text-gray-400 hover:text-purple-300 transition group">
              Transactions
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex justify-end mt-3 relative z-10">
            <button
              onClick={() => setShowTopUpModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-purple-900/30 flex items-center gap-1.5"
            >
              Top-up <span className="text-lg leading-none font-black">+</span>
            </button>
          </div>
        </div>

        {/* Header row — title left, filter right */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && <Alert type="error" message={error} />}

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6"
                >
                  {/* Top: service name + status badge + kebab menu */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <h2 className="text-base font-bold text-gray-900 truncate">
                        {booking.service?.name || 'Service'}
                      </h2>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${statusConfig.classes}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Kebab menu for destructive actions */}
                    <div className="relative" ref={openMenuId === booking._id ? menuRef : null}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === booking._id ? null : booking._id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        aria-label="More actions"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      {openMenuId === booking._id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={() => { handleDelete(booking._id); }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {booking.provider?.name || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {formatDate(booking.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {booking.provider?.location || 'N/A'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {booking.provider?.phone || 'N/A'}
                    </div>
                  </div>

                  {/* Action buttons — clear hierarchy, only for pending */}
                  {booking.status === 'pending' && (
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'completed')}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-5 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-1">No bookings yet</p>
            <p className="text-gray-400 text-sm mb-6">Start by exploring our services and booking your first one.</p>
            <button
              onClick={() => navigate('/services')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              Explore Services
            </button>
          </div>
        )}

        {/* Top Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-sm overflow-hidden relative">
              <div className="px-6 py-5 flex items-center justify-between">
                <h3 className="text-[22px] font-bold text-gray-900 tracking-tight">Top Up Wallet</h3>
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-1.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleTopUpSubmit} className="px-6 pb-6">
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-[14px] font-medium text-gray-500 mb-2">
                    Enter Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-bold select-none pointer-events-none">₦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="amount"
                      required
                      value={topUpAmount ? Number(topUpAmount).toLocaleString('en-US') : ''}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/,/g, '').replace(/[^0-9]/g, '');
                        setTopUpAmount(raw);
                      }}
                      className="block w-full pl-10 pr-4 py-4 bg-[#F7F7F8] border border-gray-200 rounded-2xl text-xl font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 focus:bg-white"
                      placeholder="0"
                      style={{ appearance: 'textfield', MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                    />
                  </div>
                </div>

                {/* Quick Amount Pills */}
                <div className="flex gap-2 mb-6 flex-wrap">
                  {[1000, 5000, 10000, 20000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(String(amt))}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${topUpAmount === String(amt)
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                        }`}
                    >
                      ₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={topUpLoading || !topUpAmount || Number(topUpAmount) < 100}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-purple-200/50"
                >
                  {topUpLoading ? (
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Continue'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

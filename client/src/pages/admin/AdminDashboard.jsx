import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, serviceAPI, providerAPI, bookingAPI, userAPI } from '../../api/services';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    services: 0,
    providers: 0,
    bookings: 0,
    users: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, servicesRes, providersRes, bookingsRes, usersRes] =
          await Promise.all([
            categoryAPI.getAll(),
            serviceAPI.getAll(),
            providerAPI.getAll(),
            bookingAPI.getAll(),
            userAPI.getAll(),
          ]);

        setStats({
          categories: categoriesRes.success ? categoriesRes.count : 0,
          services: servicesRes.success ? servicesRes.count : 0,
          providers: providersRes.success ? providersRes.count : 0,
          bookings: bookingsRes.success ? bookingsRes.count : 0,
          users: usersRes.success ? usersRes.count : 0,
        });

        // Get recent bookings (last 5)
        if (bookingsRes.success && bookingsRes.data) {
          setRecentBookings(bookingsRes.data.slice(0, 5));
        }

        // Get recent users (last 5)
        if (usersRes.success && usersRes.data) {
          const sorted = [...usersRes.data].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRecentUsers(sorted.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-700 border border-amber-200',
      completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200',
    };
    return styles[status] || styles.pending;
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-50 text-red-700 border border-red-200',
      provider: 'bg-purple-50 text-purple-700 border border-purple-200',
      user: 'bg-blue-50 text-blue-700 border border-blue-200',
    };
    return styles[role] || styles.user;
  };

  if (loading) return <Loading />;

  // Stat card config — each card is clickable
  const statCards = [
    {
      label: 'Total Users',
      value: stats.users,
      to: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: 'Providers',
      value: stats.providers,
      to: '/admin/providers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.97 3.14a1 1 0 01-1.45-1.06l1.14-6.65L.65 6.33a1 1 0 01.56-1.71l6.68-.97L10.87.69a1 1 0 011.8 0l2.98 6.06 6.68.97a1 1 0 01.56 1.71l-4.49 4.37 1.14 6.65a1 1 0 01-1.45 1.06l-5.97-3.14z" />
        </svg>
      ),
    },
    {
      label: 'Total Bookings',
      value: stats.bookings,
      to: '/admin/bookings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      label: 'Services',
      value: stats.services,
      to: '/admin/services',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: 'Categories',
      value: stats.categories,
      to: '/admin/categories',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
  ];

  // Compute pending bookings count
  const pendingCount = recentBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your platform activity</p>
        </div>

        {/* Alert bar — pending bookings */}
        {pendingCount > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span className="text-sm font-medium text-amber-800">
                {pendingCount} booking{pendingCount > 1 ? 's' : ''} pending review
              </span>
            </div>
            <Link to="/admin/bookings" className="text-sm font-semibold text-amber-700 hover:text-amber-900 transition">
              Review →
            </Link>
          </div>
        )}

        {/* KPI Stat Cards — all in one balanced row, 5 columns on lg, 3 on md */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((card) => (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {card.label}
                </span>
                <div className="text-gray-400 group-hover:text-purple-500 transition-colors">
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </Link>
          ))}
        </div>

        {/* Two-column activity layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-xs font-medium text-purple-600 hover:text-purple-800 transition">
                View all →
              </Link>
            </div>
            {recentBookings.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {booking.service?.name || 'Service'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {booking.user?.name || 'User'} · {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-gray-400">No bookings yet</p>
              </div>
            )}
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Recent Users</h2>
              <Link to="/admin/users" className="text-xs font-medium text-purple-600 hover:text-purple-800 transition">
                View all →
              </Link>
            </div>
            {recentUsers.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentUsers.map((user) => (
                  <div key={user._id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-gray-400">No users yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions — compact, single-system, no duplication */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            <Link to="/admin/categories" className="px-5 py-4 text-center hover:bg-purple-50 transition group">
              <svg className="w-5 h-5 mx-auto text-gray-400 group-hover:text-purple-600 mb-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Add Category</p>
            </Link>
            <Link to="/admin/services" className="px-5 py-4 text-center hover:bg-purple-50 transition group">
              <svg className="w-5 h-5 mx-auto text-gray-400 group-hover:text-purple-600 mb-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Add Service</p>
            </Link>
            <Link to="/admin/providers" className="px-5 py-4 text-center hover:bg-purple-50 transition group">
              <svg className="w-5 h-5 mx-auto text-gray-400 group-hover:text-purple-600 mb-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Add Provider</p>
            </Link>
            <Link to="/admin/bookings" className="px-5 py-4 text-center hover:bg-purple-50 transition group">
              <svg className="w-5 h-5 mx-auto text-gray-400 group-hover:text-purple-600 mb-2 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700">All Bookings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

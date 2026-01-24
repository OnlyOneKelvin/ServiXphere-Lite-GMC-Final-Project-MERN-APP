import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI, serviceAPI, providerAPI, bookingAPI } from '../../api/services';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    categories: 0,
    services: 0,
    providers: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [categoriesRes, servicesRes, providersRes, bookingsRes] =
          await Promise.all([
            categoryAPI.getAll(),
            serviceAPI.getAll(),
            providerAPI.getAll(),
            bookingAPI.getAll(),
          ]);

        setStats({
          categories: categoriesRes.success ? categoriesRes.count : 0,
          services: servicesRes.success ? servicesRes.count : 0,
          providers: providersRes.success ? providersRes.count : 0,
          bookings: bookingsRes.success ? bookingsRes.count : 0,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Categories</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.categories}</p>
          <Link
            to="/admin/categories"
            className="text-purple-600 hover:text-purple-800 text-sm mt-2 inline-block"
          >
            Manage →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Services</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.services}</p>
          <Link
            to="/admin/services"
            className="text-purple-600 hover:text-purple-800 text-sm mt-2 inline-block"
          >
            Manage →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Providers</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.providers}</p>
          <Link
            to="/admin/providers"
            className="text-purple-600 hover:text-purple-800 text-sm mt-2 inline-block"
          >
            Manage →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Bookings</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.bookings}</p>
          <Link
            to="/admin/bookings"
            className="text-purple-600 hover:text-purple-800 text-sm mt-2 inline-block"
          >
            View All →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/categories"
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-md transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
          <p className="text-purple-100">Add, edit, or delete service categories</p>
        </Link>

        <Link
          to="/admin/services"
          className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg shadow-md transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Services</h2>
          <p className="text-green-100">Add, edit, or delete services</p>
        </Link>

        <Link
          to="/admin/providers"
          className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg shadow-md transition text-center"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Providers</h2>
          <p className="text-purple-100">Add, edit, or delete service providers</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

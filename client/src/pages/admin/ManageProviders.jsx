import { useState, useEffect } from 'react';
import { providerAPI, serviceAPI } from '../../api/services';
import Loading from '../../components/Loading';
import Alert from '../../components/Alert';

const ManageProviders = () => {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    servicesOffered: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [providersRes, servicesRes] = await Promise.all([
        providerAPI.getAll(),
        serviceAPI.getAll(),
      ]);

      if (providersRes.success) {
        setProviders(providersRes.data);
      }
      if (servicesRes.success) {
        setServices(servicesRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingProvider) {
        const response = await providerAPI.update(editingProvider._id, formData);
        if (response.success) {
          setSuccess('Provider updated successfully!');
          setShowForm(false);
          setEditingProvider(null);
          setFormData({ name: '', phone: '', location: '', servicesOffered: [] });
          fetchData();
        }
      } else {
        const response = await providerAPI.create(formData);
        if (response.success) {
          setSuccess('Provider created successfully!');
          setShowForm(false);
          setFormData({ name: '', phone: '', location: '', servicesOffered: [] });
          fetchData();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save provider');
    }
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      phone: provider.phone,
      location: provider.location,
      servicesOffered:
        provider.servicesOffered?.map((s) => s._id || s) || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this provider?')) {
      return;
    }

    try {
      const response = await providerAPI.delete(id);
      if (response.success) {
        setSuccess('Provider deleted successfully!');
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete provider');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProvider(null);
    setFormData({ name: '', phone: '', location: '', servicesOffered: [] });
  };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => {
      const services = prev.servicesOffered;
      if (services.includes(serviceId)) {
        return { ...prev, servicesOffered: services.filter((id) => id !== serviceId) };
      } else {
        return { ...prev, servicesOffered: [...services, serviceId] };
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Providers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
        >
          {showForm ? 'Cancel' : 'Add Provider'}
        </button>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingProvider ? 'Edit Provider' : 'New Provider'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Offered
              </label>
              <div className="border border-gray-300 rounded-md p-4 max-h-48 overflow-y-auto">
                {services.map((service) => (
                  <label key={service._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={formData.servicesOffered.includes(service._id)}
                      onChange={() => handleServiceToggle(service._id)}
                      className="mr-2"
                    />
                    <span>{service.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
              >
                {editingProvider ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {provider.name}
            </h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Phone:</span> {provider.phone}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Location:</span> {provider.location}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Rating:</span>{' '}
              <span className="text-yellow-500">
                {provider.averageRating > 0
                  ? `${provider.averageRating} ⭐`
                  : 'No ratings'}
              </span>
            </p>
            {provider.servicesOffered && provider.servicesOffered.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
                <div className="flex flex-wrap gap-1">
                  {provider.servicesOffered.map((service) => (
                    <span
                      key={service._id || service}
                      className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                    >
                      {service.name || service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(provider)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(provider._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No providers found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageProviders;

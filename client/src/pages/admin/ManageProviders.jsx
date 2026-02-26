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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const svcList = prev.servicesOffered;
      if (svcList.includes(serviceId)) {
        return { ...prev, servicesOffered: svcList.filter((id) => id !== serviceId) };
      } else {
        return { ...prev, servicesOffered: [...svcList, serviceId] };
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Providers</h1>
            <p className="text-sm text-gray-500 mt-1">{providers.length} providers total</p>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setShowForm(true);
              }
            }}
            className={showForm
              ? 'border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition'
              : 'bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition'
            }
          >
            {showForm ? 'Cancel' : '+ Add Provider'}
          </button>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              {editingProvider ? 'Edit Provider' : 'New Provider'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition"
                    placeholder="e.g. Mike Plumbing Services"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition"
                    placeholder="+1-555-0101"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm transition"
                  placeholder="e.g. New York, NY"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Services Offered
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {services.map((service) => (
                    <label key={service._id} className="flex items-center py-1.5 px-1 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.servicesOffered.includes(service._id)}
                        onChange={() => handleServiceToggle(service._id)}
                        className="mr-2.5 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition"
                >
                  {editingProvider ? 'Update Provider' : 'Create Provider'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col h-full hover:border-gray-300 transition"
            >
              {/* Card content */}
              <div className="flex-grow">
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {provider.name}
                </h3>
                <div className="space-y-1 mb-3">
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {provider.phone}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {provider.location}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    {provider.averageRating > 0 ? `${provider.averageRating} ★` : 'No ratings yet'}
                  </p>
                </div>
                {provider.servicesOffered && provider.servicesOffered.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {provider.servicesOffered.map((service) => (
                      <span
                        key={service._id || service}
                        className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full border border-purple-100"
                      >
                        {service.name || service}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions — pinned to bottom */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(provider)}
                  className="text-sm font-medium text-gray-500 hover:text-purple-600 transition inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(provider._id)}
                  className="text-sm font-medium text-gray-400 hover:text-red-600 transition inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {providers.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17l-5.97 3.14a1 1 0 01-1.45-1.06l1.14-6.65L.65 6.33a1 1 0 01.56-1.71l6.68-.97L10.87.69a1 1 0 011.8 0l2.98 6.06 6.68.97a1 1 0 01.56 1.71l-4.49 4.37 1.14 6.65a1 1 0 01-1.45 1.06l-5.97-3.14z" />
            </svg>
            <p className="text-gray-500 text-sm">No providers yet. Click "+ Add Provider" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProviders;

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { providerAPI, serviceAPI } from '../api/services';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

const ProviderSettings = () => {
    const { user } = useAuth();
    const [providerId, setProviderId] = useState(null);
    const [allServices, setAllServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [servicesOffered, setServicesOffered] = useState([]);

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                setLoading(true);
                // Fetch all services for the checkboxes
                const servicesRes = await serviceAPI.getAll();
                if (servicesRes.success) {
                    setAllServices(servicesRes.data);
                }

                // Fetch the provider profile linked to the user
                const providerRes = await providerAPI.getAll(`?user=${user._id}`);

                if (providerRes.success && providerRes.data.length > 0) {
                    const provider = providerRes.data[0];
                    setProviderId(provider._id);
                    setName(provider.name || '');
                    setPhone(provider.phone || '');
                    setLocation(provider.location || '');
                    setServicesOffered(provider.servicesOffered?.map(s => s._id || s) || []);
                } else {
                    setError('Provider profile not found.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchProviderData();
        }
    }, [user]);

    const handleServiceToggle = (serviceId) => {
        setServicesOffered(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setSaving(true);
        try {
            const updateData = {
                name,
                phone,
                location,
                servicesOffered
            };
            const response = await providerAPI.update(providerId, updateData);
            if (response.success) {
                setSuccess('Profile updated successfully!');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Provider Settings</h1>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl mx-auto">
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business / Provider Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Services Offered
                        </label>
                        <p className="text-sm text-gray-500 mb-3">Select the services you provide.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-gray-200 rounded-md p-4 max-h-60 overflow-y-auto">
                            {allServices.map(service => (
                                <label key={service._id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={servicesOffered.includes(service._id)}
                                        onChange={() => handleServiceToggle(service._id)}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <span className="text-gray-700">{service.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || !providerId}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
                    >
                        {saving ? 'Saving Changes...' : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProviderSettings;

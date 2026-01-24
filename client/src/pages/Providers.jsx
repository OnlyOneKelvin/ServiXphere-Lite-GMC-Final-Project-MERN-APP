import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { providerAPI, serviceAPI } from "../api/services"; // correct path
import Loading from "../components/Loading";
import Alert from "../components/Alert";

const Providers = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");

  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(serviceId || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [providersRes, servicesRes] = await Promise.all([
          providerAPI.getAll(selectedService || null),
          serviceAPI.getAll(),
        ]);

        if (providersRes.success) setProviders(providersRes.data);
        if (servicesRes.success) setServices(servicesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load providers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedService]);

  const handleServiceChange = (e) => setSelectedService(e.target.value);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-black">ServiX </span>
          <span className="text-purple-600">Providers</span>
        </h2>

        {error && <Alert type="error" message={error} />}

        {/* Service Filter */}
        <div className="mt-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Service
          </label>
          <select
            value={selectedService}
            onChange={handleServiceChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Services</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider._id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {provider.name}
            </h2>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Location:</span> {provider.location}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Phone:</span> {provider.phone}
            </p>
            <div className="mb-4">
              <span className="font-medium text-gray-700">Rating: </span>
              <span className="text-yellow-500 font-semibold">
                {provider.averageRating > 0
                  ? `${provider.averageRating} ⭐`
                  : "No ratings yet"}
              </span>
            </div>
            {provider.servicesOffered && provider.servicesOffered.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-gray-700 mb-1">Services Offered:</p>
                <div className="flex flex-wrap gap-2">
                  {provider.servicesOffered.map((service) => (
                    <span
                      key={service._id}
                      className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded"
                    >
                      {service.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Link
              to={`/providers/${provider._id}`}
              className="text-purple-600 hover:text-purple-800 font-medium inline-block"
            >
              View Profile →
            </Link>
          </div>
        ))}
      </div>

      {providers.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No providers found.</p>
        </div>
      )}
    </div>
  );
};

export default Providers;

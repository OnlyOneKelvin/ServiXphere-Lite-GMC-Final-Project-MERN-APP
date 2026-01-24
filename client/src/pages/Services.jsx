import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { serviceAPI, categoryAPI } from "../api/services"; // Correct path
import Loading from "../components/Loading";             // Correct path
import Alert from "../components/Alert";                 // Correct path

const Services = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesRes, categoriesRes] = await Promise.all([
          serviceAPI.getAll(selectedCategory || null),
          categoryAPI.getAll(),
        ]);

        if (servicesRes.success) setServices(servicesRes.data);
        if (categoriesRes.success) setCategories(categoriesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-black">Services </span>{" "}
          <span className="text-purple-600">Available</span>
        </h2>

        {error && <Alert type="error" message={error} />}

        {/* Category Filter */}
        <div className="mt-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {service.name}
            </h2>
            <p className="text-gray-600 mb-4">
              {service.description || "No description"}
            </p>
            {service.category && (
              <p className="text-sm text-purple-600 mb-4">
                Category: {service.category.name}
              </p>
            )}
            <Link
              to={`/providers?service=${service._id}`}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              View Providers →
            </Link>
          </div>
        ))}
      </div>

      {services.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No services found.</p>
        </div>
      )}
    </div>
  );
};

export default Services;

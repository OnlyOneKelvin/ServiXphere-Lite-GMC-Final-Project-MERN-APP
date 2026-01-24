import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../api/services';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

// Import CustomerTestimonials
import CustomerTestimonials from "../components/CustomerTestimonials";

import HeroImg from '../assets/images/hero.png';


const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category metadata mapping
  const getCategoryMetadata = (categoryName) => {
    const metadata = {
      'Technology': {
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
        description: 'IT and technology support services, including device repair, software troubleshooting, and smart home setup.'
      },
      'Beauty & Wellness': {
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        description: 'Personal care, wellness, and beauty services such as barbing, make up, hair styling, skincare, massage, and spa treatments.'
      },
      'Home Services': {
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        description: 'Professional home maintenance and repair services, including plumbing, painting, electrical, carpentry, and general handyman work.'
      },
      'Automobile Services': {
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 0a2 2 0 100-4h8a2 2 0 100 4m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V7m-8 0H5a2 2 0 00-2 2v10a2 2 0 002 2h3m10-12h3a2 2 0 012 2v10a2 2 0 01-2 2h-3m-6-4a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        ),
        description: 'Trusted car services, including car wash, mechanical repairs, maintenance, detailing, and tire services.'
      }
    };

    return metadata[categoryName] || {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      description: categoryName || 'No description'
    };
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12 mt-8">
        <div className="order-2 lg:order-1">
          <h1 className="mb-4">
            <span className="text-3xl md:text-4xl font-medium text-black">Welcome to </span>
            <span className="text-4xl md:text-5xl font-bold text-purple-600">ServiXphere</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
            Find Trusted Service Professionals Close To You.
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            ServiXphere is a smart service marketplace that connects users with trusted service providers across categories like home services, tech repairs, beauty & wellness, and automobile services.
          </p>
        </div>
       <div className="order-1 lg:order-2">
  <img
    src={HeroImg}
    alt="ServiXphere Hero"
    className="w-full h-auto rounded-lg shadow-lg object-cover"
  />
</div>

      </div>

      {error && <Alert type="error" message={error} />}

      {/* How It Works Section */}
      <div className="mb-16 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-black">How It</span> <span className="text-purple-600">Works</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Follow these simple steps to connect with skilled professionals in your area.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-600 rounded-full p-4 mb-4 hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Request service</h3>
            <p className="text-gray-600">
              Tell us what you need done. Describe your project, set your budget, and
              specify your timeline.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-600 rounded-full p-4 mb-4 hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Get connected</h3>
            <p className="text-gray-600">
              Our smart algorithm connects you with qualified professionals with highest
              rating in your area who specialize in your needs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-600 rounded-full p-4 mb-4 hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Job Done</h3>
            <p className="text-gray-600">
              Your chosen professional arrives on time and completes the work to your
              satisfaction.
            </p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-600 rounded-full p-4 mb-4 hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Secure payment</h3>
            <p className="text-gray-600">
              Pay securely through the app only when you're completely satisfied with the
              completed work.
            </p>
          </div>
        </div>

        </div>
      

      {/* Category Section */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-black">Browse By</span>{' '}
            <span className="text-purple-600">Category</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Find skilled professionals for every project. All professionals are verified and rated by customers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const metadata = getCategoryMetadata(category.name);
          const displayDescription = metadata.description || category.description || 'No description';
          return (
            <Link
              key={category._id}
              to={`/services?category=${category._id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-purple-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-600 rounded-full p-4 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {metadata.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{category.name}</h2>
                <p className="text-gray-600 leading-relaxed">{displayDescription}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {categories.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No categories available yet.</p>
        </div>
      )}

      {/* ✅ Add Customer Testimonials Section here */}
      <CustomerTestimonials />
    </div>
  );
};

export default Home;

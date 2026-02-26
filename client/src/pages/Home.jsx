import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../api/services';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

// Import CustomerTestimonials
import CustomerTestimonials from "../components/CustomerTestimonials";

// Use Unsplash instead of local image
// Remove the watermarked local image dependency


const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category metadata mapping
  const getCategoryMetadata = (categoryName) => {
    const metadata = {
      'Technology': {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
        description: 'IT and technology support services, including device repair, software troubleshooting, and smart home setup.'
      },
      'Beauty & Wellness': {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        description: 'Personal care, wellness, and beauty services such as barbing, make up, hair styling, skincare, massage, and spa treatments.'
      },
      'Home Services': {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        description: 'Professional home maintenance and repair services, including plumbing, painting, electrical, carpentry, and general handyman work.'
      },
      'Automobile Services': {
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 0a2 2 0 100-4h8a2 2 0 100 4m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V7m-8 0H5a2 2 0 00-2 2v10a2 2 0 002 2h3m10-12h3a2 2 0 012 2v10a2 2 0 01-2 2h-3m-6-4a2 2 0 100-4 2 2 0 000 4zm-8 0a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        ),
        description: 'Trusted car services, including car wash, mechanical repairs, maintenance, detailing, and tire services.'
      }
    };

    return metadata[categoryName] || {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          <h1 className="mb-4">
            <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black block mb-2">Welcome to </span>
            <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-purple-600 block">ServiXphere</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-gray-700 mb-6 mt-4">
            Find Trusted Service Professionals Close To You.
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
            ServiXphere is a smart service marketplace that connects you with verified local experts for home services, tech repairs, wellness, and auto care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/services" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors text-center text-lg">
              Find a Professional
            </Link>
            <Link to="/signup" className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-8 border border-gray-300 rounded-lg shadow-sm transition-colors text-center text-lg">
              Become a Provider
            </Link>
          </div>
        </div>
        <div className="order-1 lg:order-2 flex justify-center items-center">
          <img
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop"
            alt="ServiXphere Professional"
            className="w-full max-w-lg h-auto rounded-2xl shadow-2xl object-cover ring-1 ring-gray-900/5 aspect-square sm:aspect-auto"
          />
        </div>

      </div>

      {error && <Alert type="error" message={error} />}

      {/* How It Works Section */}
      <div className="mb-16 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gray-900">How It </span><span className="text-purple-600">Works</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Follow these simple steps to connect with skilled professionals in your area.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Connecting line — perfectly centered through the step circles (desktop only) */}
          <div className="hidden lg:block absolute top-[40px] left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Request service
              </h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed px-2">
                Tell us what you need. Describe your project, set your budget, and timeframe.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-purple-50 border-2 border-purple-200 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get connected
              </h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed px-2">
                Our smart algorithm connects you with top-rated professionals in your area.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Job done
              </h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed px-2">
                Your chosen pro arrives on time and completes the work to your satisfaction.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-5">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Secure payment
              </h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed px-2">
                Pay securely through the app only when the job is fully completed.
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Category Section */}
      <div className="mb-16 mt-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Browse By Category
          </h2>
          <div className="w-16 h-1 bg-purple-600 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find skilled professionals for every project. All professionals are verified and rated by customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.length > 0 ? (
            categories.map((category) => {
              const metadata = getCategoryMetadata(category.name);
              const displayDescription = metadata.description || category.description || 'Professional services available';
              return (
                <Link
                  key={category._id}
                  to={`/services?category=${category._id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-purple-200 group flex flex-col h-full hover:-translate-y-1"
                >
                  <div className="flex flex-col flex-grow">
                    {/* Icon — centered */}
                    <div className="flex justify-center mb-5">
                      <div className="bg-purple-50 text-purple-600 rounded-xl p-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                        {metadata.icon}
                      </div>
                    </div>
                    {/* Title — centered */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{category.name}</h3>
                    {/* Description — left-aligned for readability */}
                    <p className="text-gray-600 leading-relaxed text-sm flex-grow mb-4">{displayDescription}</p>
                    <span className="text-purple-600 text-sm font-semibold group-hover:text-purple-700 transition">
                      Explore services →
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            !loading && (
              ['Technology', 'Beauty & Wellness', 'Home Services', 'Automobile Services'].map((mockName, idx) => {
                const mockMeta = getCategoryMetadata(mockName);
                return (
                  <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col h-full">
                    <div className="flex justify-center mb-5">
                      <div className="bg-purple-50 text-purple-600 rounded-xl p-4">
                        {mockMeta.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{mockName}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm flex-grow">{mockMeta.description}</p>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* ✅ Add Customer Testimonials Section here */}
      <CustomerTestimonials />
    </div>
  );
};

export default Home;

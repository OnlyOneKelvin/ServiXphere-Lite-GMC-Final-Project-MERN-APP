// ./pages/About.jsx
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header — left-aligned for consistent flow */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About <span className="text-purple-600">ServiXphere</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
            ServiXphere is a smart service marketplace connecting you with trusted service
            providers across categories like home services, technology, beauty &amp; wellness,
            and automobile services.
          </p>
        </div>

        {/* Our Mission — left-aligned, bounded width */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            We aim to simplify the process of finding skilled and reliable professionals
            for any project, big or small. All our providers are verified, rated, and
            trusted by our community.
          </p>
        </div>

        {/* Our Values — cards with icons and even padding */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Trust</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We verify all service providers to ensure reliability and quality work.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Convenience</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Find and book professionals for any service from the comfort of your home.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We connect you with highly rated professionals who deliver top-notch services.
            </p>
          </div>
        </div>

        {/* Call to Action — left-aligned to match flow */}
        <div className="bg-purple-50 rounded-xl p-8 border border-purple-100">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ready to get started?</h3>
          <p className="text-gray-600 mb-5">
            Explore our services and find your trusted professional today.
          </p>
          <Link
            to="/services"
            className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-sm transition"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

// ./pages/About.jsx
const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          About <span className="text-purple-600">ServiXphere</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          ServiXphere is a smart service marketplace connecting you with trusted service providers across categories like home services, technology, beauty & wellness, and automobile services.
        </p>
      </div>

      {/* Our Mission */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-black mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          We aim to simplify the process of finding skilled and reliable professionals for any project, big or small. All our providers are verified, rated, and trusted by our community.
        </p>
      </div>

      {/* Our Values */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow p-6 rounded-lg">
          <h3 className="text-xl font-bold text-black mb-2">Trust</h3>
          <p className="text-gray-600">We verify all service providers to ensure reliability and quality work.</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h3 className="text-xl font-bold text-black mb-2">Convenience</h3>
          <p className="text-gray-600">Find and book professionals for any service from the comfort of your home.</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h3 className="text-xl font-bold text-black mb-2">Excellence</h3>
          <p className="text-gray-600">We connect you with highly rated professionals who deliver top-notch services.</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-gray-700 text-lg mb-4">
          Ready to get started? Explore our services and find your trusted professional today!
        </p>
        <a
          href="/services"
          className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Browse Services
        </a>
      </div>
    </div>
  );
};

export default About;

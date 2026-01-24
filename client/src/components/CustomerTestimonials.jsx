const testimonials = [
  {
    name: "Adebayo O.",
    role: "Home Owner",
    service: "Home Services",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "ServiXphere made it incredibly easy to find a reliable electrician. The process was smooth and stress-free."
  },
  {
    name: "Mary J.",
    role: "Business Owner",
    service: "Technology",
    image: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    text: "Finding trusted technicians used to be difficult. ServiXphere completely changed that for my business."
  },
  {
    name: "Tunde K.",
    role: "Entrepreneur",
    service: "Automobile Services",
    image: "https://i.pravatar.cc/150?img=45",
    rating: 4,
    text: "Booked a car detailing service and the experience exceeded my expectations. Highly professional."
  },
  {
    name: "Zainab S.",
    role: "Fashion Consultant",
    service: "Beauty & Wellness",
    image: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    text: "The makeup artist I found was amazing. On time, professional, and extremely skilled."
  },
  {
    name: "Chinedu A.",
    role: "Landlord",
    service: "Home Services",
    image: "https://i.pravatar.cc/150?img=58",
    rating: 4,
    text: "Plumber arrived on time and fixed everything perfectly. I’ll definitely use ServiXphere again."
  },
  {
    name: "Fatima R.",
    role: "Startup Founder",
    service: "Technology",
    image: "https://i.pravatar.cc/150?img=21",
    rating: 5,
    text: "Got fast IT support when my laptop crashed before a pitch. Lifesaver platform."
  }
];

const CustomerTestimonials = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-gray-900">Customer </span>
            <span className="text-purple-600">Testimonials</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Join thousands of satisfied individuals and businesses who trust{" "}
            <span className="font-semibold">ServiXphere</span> for their service needs.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 left-4 text-purple-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 17H5a2 2 0 01-2-2V9a2 2 0 012-2h4v10zm10 0h-4a2 2 0 01-2-2V9a2 2 0 012-2h4v10z" />
                </svg>
              </div>

              {/* Service Badge */}
              <span className="absolute top-4 right-4 text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
                {item.service}
              </span>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`text-lg ${
                      idx < item.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-500 mb-6">{item.text}</p>

              {/* User */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerTestimonials;

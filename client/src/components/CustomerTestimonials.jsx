const testimonials = [
  {
    name: "Adebayo O.",
    role: "Home Owner",
    service: "Home Services",
    image: "https://ui-avatars.com/api/?name=Adebayo+O&background=random",
    rating: 5,
    text: "ServiXphere made it incredibly easy to find a reliable electrician. The process was smooth and stress-free."
  },
  {
    name: "Mary J.",
    role: "Business Owner",
    service: "Technology",
    image: "https://ui-avatars.com/api/?name=Mary+J&background=random",
    rating: 5,
    text: "Finding trusted technicians used to be difficult. ServiXphere completely changed that for my business."
  },
  {
    name: "Tunde K.",
    role: "Entrepreneur",
    service: "Automobile Services",
    image: "https://ui-avatars.com/api/?name=Tunde+K&background=random",
    rating: 4,
    text: "Booked a car detailing service and the experience exceeded my expectations. Highly professional."
  },
  {
    name: "Zainab S.",
    role: "Fashion Consultant",
    service: "Beauty & Wellness",
    image: "https://ui-avatars.com/api/?name=Zainab+S&background=random",
    rating: 5,
    text: "The makeup artist I found was amazing. On time, professional, and extremely skilled."
  },
  {
    name: "Chinedu A.",
    role: "Landlord",
    service: "Home Services",
    image: "https://ui-avatars.com/api/?name=Chinedu+A&background=random",
    rating: 4,
    text: "Plumber arrived on time and fixed everything perfectly. I’ll definitely use ServiXphere again."
  },
  {
    name: "Fatima R.",
    role: "Startup Founder",
    service: "Technology",
    image: "https://ui-avatars.com/api/?name=Fatima+R&background=random",
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
          {testimonials.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition relative flex flex-col h-full"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 left-4 text-purple-200">
                <svg className="w-8 h-8 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Service Badge */}
              <span className="absolute top-4 right-4 text-xs bg-purple-600 text-white font-medium px-3 py-1 rounded-full shadow-sm">
                {item.service}
              </span>

              {/* Rating */}
              <div className="flex gap-1 mb-4 mt-8">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={`text-lg ${idx < item.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{item.text}</p>

              {/* User */}
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <button className="bg-white border border-gray-200 text-purple-600 font-semibold py-3 px-8 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
            Read more reviews
          </button>
        </div>

      </div>
    </section>
  );
};

export default CustomerTestimonials;

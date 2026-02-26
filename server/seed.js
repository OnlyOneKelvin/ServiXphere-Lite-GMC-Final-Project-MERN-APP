const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const ServiceCategory = require('./models/ServiceCategory');
const Service = require('./models/Service');
const ServiceProvider = require('./models/ServiceProvider');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await ServiceCategory.deleteMany();
    await Service.deleteMany();
    await ServiceProvider.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Data destroyed...');

    // Create users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@servixphere.com',
      password: 'admin123',
      role: 'admin',
    });

    const regularUser1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });

    const regularUser2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('Users created...');

    // Create categories
    const category1 = await ServiceCategory.create({
      name: 'Home Services',
      description: 'Professional home maintenance and repair services',
    });

    const category2 = await ServiceCategory.create({
      name: 'Beauty & Wellness',
      description: 'Personal care and wellness services',
    });

    const category3 = await ServiceCategory.create({
      name: 'Technology',
      description: 'IT and technology support services',
    });

    const category4 = await ServiceCategory.create({
      name: 'Automobile Services',
      description: 'Car repairs, maintenance, detailing, diagnostics, and automobile support services',
    });

    // Create services
    const service1 = await Service.create({
      name: 'Plumbing',
      description: 'Expert plumbing repairs and installations',
      category: category1._id,
    });

    const service2 = await Service.create({
      name: 'Electrical',
      description: 'Electrical repairs and installations',
      category: category1._id,
    });

    const service3 = await Service.create({
      name: 'Haircut',
      description: 'Professional haircut and styling',
      category: category2._id,
    });

    const service4 = await Service.create({
      name: 'Massage Therapy',
      description: 'Relaxing and therapeutic massage',
      category: category2._id,
    });

    const service5 = await Service.create({
      name: 'Computer Repair',
      description: 'Computer and laptop repair services',
      category: category3._id,
    });

    const service6 = await Service.create({
      name: 'Website Development',
      description: 'Custom website development',
      category: category3._id,
    });

    console.log('Services created...');

    // Create provider users (so they can log in and manage their profiles)
    const providerUser1 = await User.create({
      name: 'Mike Johnson',
      email: 'mike@example.com',
      password: 'provider123',
      role: 'provider',
    });

    const providerUser2 = await User.create({
      name: 'Sarah Electric',
      email: 'sarah@example.com',
      password: 'provider123',
      role: 'provider',
    });

    const providerUser3 = await User.create({
      name: 'Style Studio Owner',
      email: 'style@example.com',
      password: 'provider123',
      role: 'provider',
    });

    const providerUser4 = await User.create({
      name: 'Spa Manager',
      email: 'spa@example.com',
      password: 'provider123',
      role: 'provider',
    });

    const providerUser5 = await User.create({
      name: 'TechFix Owner',
      email: 'techfix@example.com',
      password: 'provider123',
      role: 'provider',
    });

    console.log('Provider users created...');

    // Create service providers (linked to their user accounts)
    const provider1 = await ServiceProvider.create({
      name: 'Mike Plumbing Services',
      phone: '+1-555-0101',
      location: 'New York, NY',
      servicesOffered: [service1._id],
      user: providerUser1._id,
      averageRating: 0,
    });

    const provider2 = await ServiceProvider.create({
      name: 'Electric Solutions Inc',
      phone: '+1-555-0102',
      location: 'Los Angeles, CA',
      servicesOffered: [service2._id],
      user: providerUser2._id,
      averageRating: 0,
    });

    const provider3 = await ServiceProvider.create({
      name: 'Style Studio',
      phone: '+1-555-0103',
      location: 'Chicago, IL',
      servicesOffered: [service3._id],
      user: providerUser3._id,
      averageRating: 0,
    });

    const provider4 = await ServiceProvider.create({
      name: 'Relaxation Spa',
      phone: '+1-555-0104',
      location: 'Miami, FL',
      servicesOffered: [service4._id],
      user: providerUser4._id,
      averageRating: 0,
    });

    const provider5 = await ServiceProvider.create({
      name: 'TechFix Pro',
      phone: '+1-555-0105',
      location: 'Seattle, WA',
      servicesOffered: [service5._id, service6._id],
      user: providerUser5._id,
      averageRating: 0,
    });

    console.log('Service providers created...');

    // Create bookings
    const booking1 = await Booking.create({
      user: regularUser1._id,
      provider: provider1._id,
      service: service1._id,
      date: new Date('2024-12-15T10:00:00Z'),
      status: 'pending',
    });

    const booking2 = await Booking.create({
      user: regularUser2._id,
      provider: provider3._id,
      service: service3._id,
      date: new Date('2024-12-20T14:00:00Z'),
      status: 'completed',
    });

    const booking3 = await Booking.create({
      user: regularUser1._id,
      provider: provider5._id,
      service: service5._id,
      date: new Date('2024-12-25T09:00:00Z'),
      status: 'pending',
    });

    console.log('Bookings created...');

    // Create reviews
    const review1 = await Review.create({
      provider: provider1._id,
      rating: 5,
      comment: 'Excellent service! Very professional and on time.',
      anonymous: true,
    });

    const review2 = await Review.create({
      provider: provider3._id,
      rating: 4,
      comment: 'Great haircut, would recommend!',
      anonymous: true,
    });

    const review3 = await Review.create({
      provider: provider5._id,
      rating: 5,
      comment: 'Fixed my laptop quickly and efficiently.',
      anonymous: false,
    });

    const review4 = await Review.create({
      provider: provider2._id,
      rating: 4,
      comment: 'Good electrical work, fair pricing.',
      anonymous: true,
    });

    console.log('Reviews created...');

    // Update provider ratings
    const providers = await ServiceProvider.find();
    for (const provider of providers) {
      const reviews = await Review.find({ provider: provider._id });
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        provider.averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
        await provider.save();
      }
    }

    console.log('Provider ratings updated...');

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await ServiceCategory.deleteMany();
    await Service.deleteMany();
    await ServiceProvider.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}

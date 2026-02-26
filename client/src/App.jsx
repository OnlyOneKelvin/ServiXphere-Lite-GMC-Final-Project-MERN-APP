import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import Services from './pages/Services';
import Providers from './pages/Providers';
import About from './pages/About';

import ProviderProfile from './pages/ProviderProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected user pages
import UserDashboard from './pages/UserDashboard';

// Protected provider pages
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderSettings from './pages/ProviderSettings';

// Protected admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCategories from './pages/admin/ManageCategories';
import ManageServices from './pages/admin/ManageServices';
import ManageProviders from './pages/admin/ManageProviders';
import ManageUsers from './pages/admin/ManageUsers';
import AdminBookings from './pages/admin/AdminBookings';

import './styles/index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/providers" element={<Providers />} />
              <Route path="/providers/:id" element={<ProviderProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected user routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected provider routes */}
              <Route
                path="/provider/dashboard"
                element={
                  <ProtectedRoute providerOnly={true}>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/provider/settings"
                element={
                  <ProtectedRoute providerOnly={true}>
                    <ProviderSettings />
                  </ProtectedRoute>
                }
              />

              {/* Protected admin routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/providers"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageProviders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

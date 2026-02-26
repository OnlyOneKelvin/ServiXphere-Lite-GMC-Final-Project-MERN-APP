import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected route for authenticated users
export const ProtectedRoute = ({ children, adminOnly = false, providerOnly = false }) => {
  const { isAuthenticated, isAdmin, isProvider, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (providerOnly && !isProvider()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

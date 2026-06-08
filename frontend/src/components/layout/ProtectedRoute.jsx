import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // still checking localStorage

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth.jsx';
export default function Protected({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}

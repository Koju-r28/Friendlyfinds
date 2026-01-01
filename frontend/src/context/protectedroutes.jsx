import { useAuth } from './AuthContext';
import LoginSignup from '../pages/LoginSignup/LoginSignup';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginSignup />;
  }

  return children;
};

export default ProtectedRoute;
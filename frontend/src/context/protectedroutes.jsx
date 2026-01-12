import { useAuth } from '../context/AuthContext';
import LoginSignup from '../pages/LoginSignup/LoginSignup';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '40vh' }}>Loading...</div>;
  }

  if (!user) {
    return <LoginSignup />;
  }

  return children;
};

export default ProtectedRoute;

import { useAuth } from './AuthContext';
import LoginSignup from '../pages/LoginSignup/LoginSignup';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // THESE LOGS SHOULD APPEAR IN CONSOLE
  console.log('🔒 ProtectedRoute Check:');
  console.log('  - Loading:', loading);
  console.log('  - User:', user);

  if (loading) {
    console.log('  ➡️ Showing loading screen');
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '20px'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    console.log('  ➡️ No user found, showing LoginSignup');
    return <LoginSignup />;
  }

  console.log('  ➡️ User authenticated, showing protected content');
  return children;
};

export default ProtectedRoute;
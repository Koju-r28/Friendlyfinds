import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/protectedroutes';
import Home from './pages/home/home'; 
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
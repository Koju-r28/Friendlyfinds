import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './context/protectedroutes';
import Home from './pages/home/home'; 
import Furniture from './pages/furniture/furniture';
import Collections from './pages/collections/collection';
import Stationery from './pages/stationery/stationery';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
        } />

          <Route path="/furniture" element={
            <ProtectedRoute>
              <Furniture />
            </ProtectedRoute>
          } />
          
          <Route path="/collections" element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
             } />
             <Route path="/stationery" element={
            <ProtectedRoute>
              <Stationery />
            </ProtectedRoute>
             } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
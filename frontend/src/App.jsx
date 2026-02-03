import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { NotificationProvider } from './context/NotificationContext';

import Home from './pages/home/home';
import Furniture from './pages/furniture/furniture';
import Collections from './pages/collections/collection';
import Stationery from './pages/stationery/stationery';
import Cart from './pages/cart/cart';
import Seller from './pages/seller/seller';
import Profile from './pages/profile/profile';
import Checkout from './pages/cart/Checkout';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import ProtectedRoute from './context/protectedroutes';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <SearchProvider>
              <Routes>

                <Route path="/login" element={<LoginSignup />} />

                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/furniture" element={<ProtectedRoute><Furniture /></ProtectedRoute>} />
                <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
                <Route path="/stationery" element={<ProtectedRoute><Stationery /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/seller" element={<ProtectedRoute><Seller /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

              </Routes>
            </SearchProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

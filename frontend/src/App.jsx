import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext'; // ✅ only once

import Home from './pages/home/home';
import Furniture from './pages/furniture/furniture';
import Collections from './pages/collections/collection';
import Stationery from './pages/stationery/stationery';
import Cart from './pages/cart/cart';
import Seller from './pages/seller/seller';
import Profile from './pages/profile/profile';
import Checkout from './pages/cart/Checkout';

import ProtectedRoute from './context/protectedroutes';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SearchProvider> {/* 🔹 wrap everything in SearchProvider */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/furniture" element={<Furniture />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/stationery" element={<Stationery />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/seller" element={<Seller />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

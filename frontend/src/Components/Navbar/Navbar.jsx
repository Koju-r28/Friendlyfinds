import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import './Navbar.css';
import logo from '../Assets/logo.png';

const Navbar = () => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="Friendly Finds" />
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search for items, categories..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Nav Links */}
        <div className="navbar-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/collections" className="nav-link">Collections</a>
          <a href="/Seller" className="nav-link">Seller</a>
          <a href="/cart" className="nav-link cart-link">
            Cart
            <span className="cart-badge">{getCartCount()}</span>
          </a>
        </div>

        {/* User Menu */}
        <div className="user-menu">
          <button className="user-avatar">👤</button>
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <span className="user-name">{user?.username}</span>
              <span className="user-email">{user?.email}</span>
            </div>

            <a href="/profile" className="dropdown-item">
              My Profile
            </a>

            <div className="dropdown-divider"></div>

            <button
              onClick={handleLogout}
              className="dropdown-item logout"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;

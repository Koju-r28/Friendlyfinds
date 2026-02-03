import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import './Navbar.css';
import logo from '../Assets/logo.png';
import { useNotifications } from '../../context/NotificationContext';
import { useState, useRef, useEffect } from 'react';


const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount()
  const { user, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
const { unreadCount, notifications, markAsRead} = useNotifications();
const [showNotifications, setShowNotifications] = useState(false);
const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };


const formatTime = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;
  return new Date(date).toLocaleDateString();
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
       <div
  className="notification-bell"
  ref={notificationRef}
  onClick={() => setShowNotifications(prev => !prev)}
>
  <svg
  width="22"
  height="22"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
</svg>

  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}

  {showNotifications && (
    <div className="notification-dropdown">
      {notifications.length === 0 && (
        <p className="empty">You're all caught up 🎉</p>
      )}

      {notifications.map(n => (
        <div
          key={n._id}
          className={`notification-item ${!n.isRead ? 'unread' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); 
            markAsRead(n._id);
            setShowNotifications(false); 
          }}
        >
          <strong>{n.title}</strong>
          <p>{n.message}</p>
          <small>{formatTime(n.createdAt)}</small>
        </div>
      ))}
    </div>
  )}
</div>


        {/* User Menu */}
           <div className="user-menu">
            <button className="user-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span className="user-name">{user?.username}</span>
                <span className="user-email">{user?.email}</span>
              </div>
              <a href="/profile" className="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                My Profile
              </a>
              <div className="dropdown-divider"></div>
              <button onClick={handleLogout} className="dropdown-item logout">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from "react";
import { useAuth } from '../../context/AuthContext'; 
import "./home.css";
import hero from "../../Components/Assets/hero.png";


const Home = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload(); 
  };
  return (
    <div className="home-container">
      {/* Logout Button - Temporary for testing */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        background: '#dc2626',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }} onClick={handleLogout}>
        <span>👋</span>
        Logout ({user?.username})
      </div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Student Gear for Less</h1>
            <p>Buy, Sell, & Swap stationery and furniture securely on University.</p>
            <p className="hero-subtitle">Turn your clutter into next semester's coffee budget.</p>
            
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search for drafter,Stationary..."
                className="search-input"
              />
              <button className="search-button">Search</button>
            </div>
          </div>
          <img src={hero} className="hero-image" alt="Hero" />
        </div>
      </section>

      {/* Browse by Category */}
      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon stationery-icon">
              <span>✏️</span>
            </div>
            <div className="category-info">
              <h3>Stationery</h3>
              <p>Books,Drafters & more</p>
            </div>
          </div>
          
          <div className="category-card">
            <div className="category-icon furniture-icon">
              <span>🪑</span>
            </div>
            <div className="category-info">
              <h3>Furniture</h3>
              <p>Desks, chairs, lamps & lighting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="recent-section">
        <div className="section-header">
          <h2>Recently Added</h2>
          <a href="#" className="view-all">View All →</a>
        </div>
        
        <div className="items-grid">
          {/* Items will be added here later */}
        </div>
      </section>
    </div>
  );
};

export default Home;
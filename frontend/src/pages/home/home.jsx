import React from "react";
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../Components/Navbar/Navbar'; // Import Navbar
import { Link } from 'react-router-dom';
import "./home.css";
import hero from "../../Components/Assets/hero.png";

const Home = () => {
  const { logout, user } = useAuth();

  return (
    <>
      <Navbar />
      
      <div className="home-container">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Student Gear for Less</h1>
              <p>Buy, Sell, & Swap stationary and furniture securely on University.</p>
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

              {/* Categories Section */}
        <section className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {/* Stationery Card */}
            <Link to="/stationary" className="category-card">
              <div className="category-icon stationary-icon">
                <span>✏️</span>
              </div>
              <div className="category-info">
                <h3>Stationery</h3>
                <p>Books,Drafters & more</p>
              </div>
            </Link>

           {/* Furniture Card - Now clickable! */}
            <Link to="/furniture" className="category-card">
              <div className="category-icon furniture-icon">
                <span>🪑</span>
              </div>
              <div className="category-info">
                <h3>Furniture</h3>
                <p>Desks, chairs, lamps & lighting</p>
              </div>
            </Link>
          </div>
        </section>

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
    </>
  );
};

export default Home;
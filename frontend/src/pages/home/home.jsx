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
            </div>
            <img src={hero} className="hero-image" alt="Hero" />
          </div>
        </section>

              {/* Categories Section */}
        <section className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories-grid">
            {/* Stationery Card */}
            <Link to="/stationery" className="category-card">
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
        <div className="info-section-bottom">
          <div className="info-header">
            <h2 className="info-main-title">Why Choose Friendly Finds?</h2>
            <p className="info-subtitle">Your trusted campus marketplace for student essentials</p>
          </div>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="info-card-icon">🎓</div>
              <h4>Student-Verified</h4>
              <p>Exclusive community of verified university students only</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">💰</div>
              <h4>Zero Fees</h4>
              <p>No hidden charges. Keep 100% of your earnings</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">🤝</div>
              <h4>Safe Meetups</h4>
              <p>Meet sellers on campus in secure, public locations</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">♻️</div>
              <h4>Eco-Friendly</h4>
              <p>Reduce waste by giving items a second life</p>
            </div>
          </div>
           
<footer className="footer">
  <div className="footer-content">
    <div className="footer-grid">
      
      <div className="footer-section">
        <h3>Friendly Finds</h3>
        <p>
          Your trusted campus marketplace for student essentials. 
          Buy and sell items safely within your university community.
        </p>
      </div>

      
      <div className="footer-section">
        <h3>Quick Links</h3>
        <ul className="footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/collections">Collections</a></li>
          <li><a href="/seller">Sell Item</a></li>
          <li><a href="/profile">Profile</a></li>
        </ul>
      </div>

      

      
     
    </div>

    
    <div className="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Friendly Finds. All rights reserved.</p>
    </div>
  </div>
</footer>
          
        
        </div>
      </div>
    </>
  );
};

export default Home;
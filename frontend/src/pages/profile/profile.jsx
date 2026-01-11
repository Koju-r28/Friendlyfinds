import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Replace this URL with your actual API endpoint
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth token from localStorage or context
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="ff-profile-container">
        <div className="ff-loading">Loading profile...</div>
      </div>
    );
  }

  // Show error if no user data
  if (!userData) {
    return (
      <div className="ff-profile-container">
        <div className="ff-error">Failed to load profile. Please try again.</div>
      </div>
    );
  }

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="ff-profile-container">
      <div className="ff-profile-wrapper">
        {/* Sidebar */}
        <aside className="ff-profile-sidebar">
          <div className="ff-profile-avatar-section">
            <div className="ff-profile-avatar">
              <span>{getInitials(userData.name)}</span>
            </div>
            <h2 className="ff-profile-username">{userData.name}</h2>
            <p className="ff-profile-location">
              📍 {userData.location || 'Location not set'}
            </p>
            <button className="ff-edit-profile-btn">
              ✏️ Edit Profile
            </button>
          </div>

          <div className="ff-profile-stats">
            <div className="ff-stat-item">
              <span className="ff-stat-icon">🛍️</span>
              <div>
                <span className="ff-stat-number">{userData.stats?.listings || 0}</span>
                <span className="ff-stat-label">Listings</span>
              </div>
            </div>
            <div className="ff-stat-item">
              <span className="ff-stat-icon">⭐</span>
              <div>
                <span className="ff-stat-number">{userData.stats?.rating || 0}</span>
                <span className="ff-stat-label">Rating</span>
              </div>
            </div>
            <div className="ff-stat-item">
              <span className="ff-stat-icon">💚</span>
              <div>
                <span className="ff-stat-number">{userData.stats?.sold || 0}</span>
                <span className="ff-stat-label">Sold</span>
              </div>
            </div>
          </div>

          <nav className="ff-profile-nav">
            <button 
              className={`ff-nav-item ${activeSection === 'about' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('about')}
            >
              About
            </button>
            <button 
              className={`ff-nav-item ${activeSection === 'listings' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('listings')}
            >
              My Listings
            </button>
            <button 
              className={`ff-nav-item ${activeSection === 'saved' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('saved')}
            >
              Saved Items
            </button>
            <button 
              className={`ff-nav-item ${activeSection === 'reviews' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('reviews')}
            >
              Reviews
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="ff-profile-main">
          {activeSection === 'about' && (
            <div className="ff-content-section">
              <h3 className="ff-section-title">About Me</h3>
              <div className="ff-about-card">
                <p className="ff-about-text">
                  {userData.bio || 'No bio added yet.'}
                </p>
                <div className="ff-contact-info">
                  <div className="ff-contact-row">
                    <span className="ff-contact-icon">📧</span>
                    <span>{userData.email}</span>
                  </div>
                  {userData.phone && (
                    <div className="ff-contact-row">
                      <span className="ff-contact-icon">📱</span>
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  <div className="ff-contact-row">
                    <span className="ff-contact-icon">💬</span>
                    <span>Member since {new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'listings' && (
            <div className="ff-content-section">
              <h3 className="ff-section-title">My Active Listings</h3>
              {userData.listings && userData.listings.length > 0 ? (
                <div className="ff-listings-grid">
                  {userData.listings.map(item => (
                    <div key={item.id} className="ff-listing-card">
                      <div className="ff-listing-image">
                        {item.image || '📦'}
                      </div>
                      <div className="ff-listing-info">
                        <h4 className="ff-listing-name">{item.name}</h4>
                        <p className="ff-listing-price">${item.price}</p>
                        <p className="ff-listing-views">👁️ {item.views || 0} views</p>
                      </div>
                      <button className="ff-listing-edit-btn">Edit</button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ff-empty-message">You haven't listed any items yet.</p>
              )}
            </div>
          )}

          {activeSection === 'saved' && (
            <div className="ff-content-section">
              <h3 className="ff-section-title">Saved Items</h3>
              {userData.savedItems && userData.savedItems.length > 0 ? (
                <div className="ff-saved-list">
                  {userData.savedItems.map(item => (
                    <div key={item.id} className="ff-saved-item">
                      <div className="ff-saved-image">{item.image || '📦'}</div>
                      <div className="ff-saved-details">
                        <h4 className="ff-saved-name">{item.name}</h4>
                        <p className="ff-saved-price">${item.price}</p>
                        <p className="ff-saved-seller">by {item.seller}</p>
                      </div>
                      <div className="ff-saved-actions">
                        <button className="ff-remove-btn">❤️</button>
                        <button className="ff-contact-seller-btn">Contact</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ff-empty-message">You haven't saved any items yet.</p>
              )}
            </div>
          )}

          {activeSection === 'reviews' && (
            <div className="ff-content-section">
              <h3 className="ff-section-title">Reviews ({userData.reviews?.length || 0})</h3>
              <div className="ff-reviews-summary">
                <div className="ff-rating-large">
                  <span className="ff-rating-star">⭐</span>
                  <span className="ff-rating-number">{userData.stats?.rating || 0}</span>
                </div>
                <p className="ff-rating-text">Based on {userData.reviews?.length || 0} reviews</p>
              </div>
              {userData.reviews && userData.reviews.length > 0 ? (
                <div className="ff-reviews-list">
                  {userData.reviews.map((review, index) => (
                    <div key={index} className="ff-review-item">
                      <div className="ff-review-header">
                        <strong>{review.reviewerName}</strong>
                        <div className="ff-review-stars">{'⭐'.repeat(review.rating)}</div>
                      </div>
                      <p className="ff-review-text">{review.comment}</p>
                      <span className="ff-review-date">
                        {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ff-empty-message">No reviews yet.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
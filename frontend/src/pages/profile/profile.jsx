import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token);
      
      if (!token) {
        setError('Please log in to view your profile');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const transformedData = {
        name: data.name || data.username || 'User',
        email: data.email || '',
        location: data.location || 'Location not set',
        phone: data.phone || null,
        bio: data.bio || 'No bio added yet.',
        createdAt: data.createdAt || new Date().toISOString(),
        stats: {
          listings: data.stats?.listings || 0,
          rating: data.stats?.rating || 0,
          sold: data.stats?.sold || 0
        },
        listings: data.listings || [],
        savedItems: data.savedItems || [],
        reviews: data.reviews || []
      };

      setUserData(transformedData);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message || 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEditListing = (itemId) => {
    console.log('Edit listing:', itemId);
  };

  const handleRemoveSaved = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/saved/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUserData();
      }
    } catch (error) {
      console.error('Error removing saved item:', error);
    }
  };

  const handleContactSeller = (sellerId) => {
    console.log('Contact seller:', sellerId);
  };

  if (loading) {
    return (
      <div className="ff-profile-container">
        <div className="ff-loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ff-profile-container">
        <div className="ff-error">{error}</div>
        <button 
          onClick={fetchUserData}
          style={{
            margin: '1rem auto',
            display: 'block',
            padding: '0.75rem 1.5rem',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="ff-profile-container">
        <div className="ff-error">Failed to load profile. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="ff-profile-container">
      <div className="ff-profile-wrapper">
        <aside className="ff-profile-sidebar">
          <div className="ff-profile-avatar-section">
            <div className="ff-profile-avatar">
              <span>{getInitials(userData.name)}</span>
            </div>
            <h2 className="ff-profile-username">{userData.name}</h2>
            <p className="ff-profile-location">
              📍 {userData.location}
            </p>
            <button className="ff-edit-profile-btn">
              ✏️ Edit Profile
            </button>
          </div>

          <div className="ff-profile-stats">
            <div className="ff-stat-item">
              <span className="ff-stat-icon">🛍️</span>
              <div>
                <span className="ff-stat-number">{userData.stats.listings}</span>
                <span className="ff-stat-label">Listings</span>
              </div>
            </div>
            <div className="ff-stat-item">
              <span className="ff-stat-icon">⭐</span>
              <div>
                <span className="ff-stat-number">{userData.stats.rating.toFixed(1)}</span>
                <span className="ff-stat-label">Rating</span>
              </div>
            </div>
            <div className="ff-stat-item">
              <span className="ff-stat-icon">💚</span>
              <div>
                <span className="ff-stat-number">{userData.stats.sold}</span>
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

        <main className="ff-profile-main">
          {activeSection === 'about' && (
            <div className="ff-content-section">
              <h3 className="ff-section-title">About Me</h3>
              <div className="ff-about-card">
                <p className="ff-about-text">
                  {userData.bio}
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
                    <div key={item._id || item.id} className="ff-listing-card">
                      <div className="ff-listing-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="ff-listing-info">
                        <h4 className="ff-listing-name">{item.name || item.title}</h4>
                        <p className="ff-listing-price">Rs.{item.price}</p>
                        <p className="ff-listing-views">👁️ {item.views || 0} views</p>
                      </div>
                      <button 
                        className="ff-listing-edit-btn"
                        onClick={() => handleEditListing(item._id || item.id)}
                      >
                        Edit
                      </button>
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
                    <div key={item._id || item.id} className="ff-saved-item">
                      <div className="ff-saved-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}} />
                        ) : (
                          '📦'
                        )}
                      </div>
                      <div className="ff-saved-details">
                        <h4 className="ff-saved-name">{item.name || item.title}</h4>
                        <p className="ff-saved-price">Rs.{item.price}</p>
                        <p className="ff-saved-seller">by {item.sellerName || item.seller}</p>
                      </div>
                      <div className="ff-saved-actions">
                        <button 
                          className="ff-remove-btn"
                          onClick={() => handleRemoveSaved(item._id || item.id)}
                          title="Remove from saved"
                        >
                          ❤️
                        </button>
                        <button 
                          className="ff-contact-seller-btn"
                          onClick={() => handleContactSeller(item.sellerId)}
                        >
                          Contact
                        </button>
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
                  <span className="ff-rating-number">{userData.stats.rating.toFixed(1)}</span>
                </div>
                <p className="ff-rating-text">Based on {userData.reviews?.length || 0} reviews</p>
              </div>
              {userData.reviews && userData.reviews.length > 0 ? (
                <div className="ff-reviews-list">
                  {userData.reviews.map((review, index) => (
                    <div key={review._id || index} className="ff-review-item">
                      <div className="ff-review-header">
                        <strong>{review.reviewerName || 'Anonymous'}</strong>
                        <div className="ff-review-stars">{'⭐'.repeat(review.rating || 5)}</div>
                      </div>
                      <p className="ff-review-text">{review.comment || review.text}</p>
                      <span className="ff-review-date">
                        {new Date(review.date || review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
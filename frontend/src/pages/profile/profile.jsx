import React, { useState, useEffect } from 'react';
import './profile.css';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [notification, setNotification] = useState(null);
  const [saving, setSaving] = useState(false);

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
        birthdate: data.birthdate || '',
        bio: data.bio || 'No bio added yet.',
        createdAt: data.createdAt || new Date().toISOString(),
        profileImage: data.profileImage || null,
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
      setEditForm(transformedData);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message || 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompleteness = () => {
    if (!userData) return 0;
    const fields = ['name', 'email', 'location', 'phone', 'birthdate', 'bio', 'profileImage'];
    const completed = fields.filter(field => userData[field] && userData[field] !== '').length;
    return Math.round((completed / fields.length) * 100);
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

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('Please log in to update your profile', 'error');
        return;
      }

      // Prepare the data to send
      const profileData = {
        name: editForm.name,
        email: editForm.email,
        location: editForm.location,
        phone: editForm.phone,
        birthdate: editForm.birthdate,
        bio: editForm.bio,
        profileImage: editForm.profileImage
      };

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedData = await response.json();
      
      // Update local state with the response from server
      const transformedData = {
        ...userData,
        name: updatedData.name || editForm.name,
        email: updatedData.email || editForm.email,
        location: updatedData.location || editForm.location,
        phone: updatedData.phone || editForm.phone,
        birthdate: updatedData.birthdate || editForm.birthdate,
        bio: updatedData.bio || editForm.bio,
        profileImage: updatedData.profileImage || editForm.profileImage
      };
      
      setUserData(transformedData);
      setEditForm(transformedData);
      setShowEditModal(false);
      showNotification('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification(error.message || 'Failed to update profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
        showNotification('Item removed from saved');
      }
    } catch (error) {
      console.error('Error removing saved item:', error);
      showNotification('Failed to remove item', 'error');
    }
  };

  const handleContactSeller = (sellerId) => {
    console.log('Contact seller:', sellerId);
  };

  if (loading) {
    return (
      <div className="ff-profile-container">
        <div className="ff-loading-screen">
          <div className="ff-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ff-profile-container">
        <div className="ff-error-screen">
          <div className="ff-error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p className="ff-error-message">{error}</p>
          <button onClick={fetchUserData} className="ff-retry-btn">
            Try Again
          </button>
        </div>
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

  const completeness = calculateProfileCompleteness();

  return (
    <div className="ff-profile-container">
      {/* Header Navigation */}
      <div className="ff-header-nav">
        <div className="ff-nav-left">
          <button onClick={handleGoBack} className="ff-nav-home-btn">
            🏠 Home
          </button>
        </div>
        <h1 className="ff-header-title">My Profile</h1>
        <div className="ff-nav-right"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`ff-notification ${notification.type === 'success' ? 'ff-notification-success' : 'ff-notification-error'}`}>
          <span className="ff-notification-icon">
            {notification.type === 'success' ? '✓' : '⚠️'}
          </span>
          {notification.message}
        </div>
      )}

      <div className="ff-profile-wrapper">
        <aside className="ff-profile-sidebar">
          <div className="ff-profile-header-banner"></div>
          
          <div className="ff-profile-avatar-section">
            <div className="ff-profile-avatar-wrapper">
              <div className="ff-profile-avatar">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt={userData.name} className="ff-avatar-image" />
                ) : (
                  <span>{getInitials(userData.name)}</span>
                )}
              </div>
              <button onClick={() => setShowEditModal(true)} className="ff-avatar-edit-btn">
                📷
              </button>
            </div>
            
            <h2 className="ff-profile-username">{userData.name}</h2>
            <p className="ff-profile-location">
              📍 {userData.location}
            </p>

            {/* Profile Completeness */}
            <div className="ff-profile-completeness">
              <div className="ff-completeness-header">
                <span className="ff-completeness-label">Profile Completeness</span>
                <span className="ff-completeness-value">{completeness}%</span>
              </div>
              <div className="ff-completeness-bar">
                <div className="ff-completeness-progress" style={{ width: `${completeness}%` }}></div>
              </div>
            </div>

            <button onClick={() => setShowEditModal(true)} className="ff-edit-profile-btn">
              ✏️ Edit Profile
            </button>
          </div>

          <div className="ff-profile-stats">
            <div className="ff-stat-item ff-stat-listings">
              <span className="ff-stat-icon">🛍️</span>
              <div>
                <span className="ff-stat-number">{userData.stats.listings}</span>
                <span className="ff-stat-label">Active Listings</span>
              </div>
            </div>
            <div className="ff-stat-item ff-stat-rating">
              <span className="ff-stat-icon">⭐</span>
              <div>
                <span className="ff-stat-number">{userData.stats.rating.toFixed(1)}</span>
                <span className="ff-stat-label">Average Rating</span>
              </div>
            </div>
            <div className="ff-stat-item ff-stat-sold">
              <span className="ff-stat-icon">💚</span>
              <div>
                <span className="ff-stat-number">{userData.stats.sold}</span>
                <span className="ff-stat-label">Items Sold</span>
              </div>
            </div>
          </div>

          <nav className="ff-profile-nav">
            <button 
              className={`ff-nav-item ${activeSection === 'about' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('about')}
            >
              <span className="ff-nav-icon">👤</span> About Me
            </button>
            <button 
              className={`ff-nav-item ${activeSection === 'listings' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('listings')}
            >
              <span className="ff-nav-icon">📦</span> My Listings
            </button>
            <button 
              className={`ff-nav-item ${activeSection === 'saved' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('saved')}
            >
              <span className="ff-nav-icon">❤️</span> Saved Items
            </button>
            <button 
              className={`ff-nav-item ${activeSection === 'reviews' ? 'ff-active' : ''}`}
              onClick={() => setActiveSection('reviews')}
            >
              <span className="ff-nav-icon">⭐</span> Reviews
            </button>
          </nav>
        </aside>

        <main className="ff-profile-main">
          {activeSection === 'about' && (
            <div className="ff-content-section">
              <h3 className="ff-section-title">About Me</h3>
              
              <div className="ff-about-bio-card">
                <h4 className="ff-bio-label">Bio</h4>
                <p className="ff-about-text">{userData.bio}</p>
              </div>

              <div className="ff-contact-grid">
                <div className="ff-contact-card ff-card-email">
                  <div className="ff-contact-card-header">
                    <span className="ff-contact-icon">📧</span>
                    <h4>Email</h4>
                  </div>
                  <p>{userData.email}</p>
                </div>

                {userData.phone && (
                  <div className="ff-contact-card ff-card-phone">
                    <div className="ff-contact-card-header">
                      <span className="ff-contact-icon">📱</span>
                      <h4>Phone</h4>
                    </div>
                    <p>{userData.phone}</p>
                  </div>
                )}

                <div className="ff-contact-card ff-card-location">
                  <div className="ff-contact-card-header">
                    <span className="ff-contact-icon">📍</span>
                    <h4>Location</h4>
                  </div>
                  <p>{userData.location}</p>
                </div>

                {userData.birthdate && (
                  <div className="ff-contact-card ff-card-birthday">
                    <div className="ff-contact-card-header">
                      <span className="ff-contact-icon">🎂</span>
                      <h4>Birthday</h4>
                    </div>
                    <p>{new Date(userData.birthdate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                )}

                <div className="ff-contact-card ff-card-member">
                  <div className="ff-contact-card-header">
                    <span className="ff-contact-icon">👤</span>
                    <h4>Member Since</h4>
                  </div>
                  <p>{new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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
                          <img src={item.image} alt={item.name} />
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
                <div className="ff-empty-state">
                  <div className="ff-empty-icon">📦</div>
                  <h4>No listings yet</h4>
                  <p>Start selling by creating your first listing!</p>
                  <button className="ff-create-listing-btn">Create Listing</button>
                </div>
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
                          <img src={item.image} alt={item.name} />
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
                <div className="ff-empty-state">
                  <div className="ff-empty-icon">❤️</div>
                  <h4>No saved items</h4>
                  <p>Items you save will appear here</p>
                </div>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="ff-modal-overlay">
          <div className="ff-modal-content">
            <div className="ff-modal-header">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditForm(userData);
                }}
                className="ff-modal-back-btn"
                title="Cancel and go back"
              >
                ←
              </button>
              <h3>Edit Profile</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditForm(userData);
                }}
                className="ff-modal-close-btn"
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="ff-modal-body">
              {/* Profile Image Upload */}
              <div className="ff-image-upload-section">
                <label className="ff-image-upload-label">
                  <div className="ff-upload-avatar-wrapper">
                    <div className="ff-upload-avatar">
                      {editForm.profileImage ? (
                        <img src={editForm.profileImage} alt="Profile" />
                      ) : (
                        getInitials(editForm.name)
                      )}
                    </div>
                    <div className="ff-upload-icon">📷</div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="ff-file-input"
                  />
                </label>
                <p className="ff-upload-hint">Click to upload profile picture</p>
              </div>

              {/* Form Fields */}
              <div className="ff-form-grid">
                <div className="ff-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="ff-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="ff-form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    placeholder="+977-9841234567"
                  />
                </div>

                <div className="ff-form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    value={editForm.birthdate || ''}
                    onChange={(e) => setEditForm({...editForm, birthdate: e.target.value})}
                  />
                </div>

                <div className="ff-form-group ff-form-group-full">
                  <label>Location</label>
                  <input
                    type="text"
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="City, Country"
                  />
                </div>

                <div className="ff-form-group ff-form-group-full">
                  <label>Bio</label>
                  <textarea
                    value={editForm.bio || ''}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="ff-modal-actions">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditForm(userData);
                  }}
                  className="ff-cancel-btn"
                  disabled={saving}
                >
                  ✕ Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="ff-save-btn"
                >
                  {saving ? (
                    <>
                      <span className="ff-spinner-small"></span>
                      Saving...
                    </>
                  ) : (
                    <>💾 Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
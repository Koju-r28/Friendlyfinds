import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import './stationery.css';

  const Stationery= () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const { addToCart } = useCart();
  
    // Modal & buy form state
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [buyForm, setBuyForm] = useState({
      name: '',
      email: '',
      location:'',
      message: ''
    });
  
  const stationeryItems = [
    {
      id: 'stat-1',
      name: 'Engineering Drafter',
      price: 200,
      category: 'drafting',
      condition: 'Like New',
      seller: 'Ritu Koju',
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
      location: 'Buddha park,28 kilo'
    },
    {
      id: 'stat-2',
      name: 'Scientific Calculator',
      price: 450,
      category: 'calculator',
      condition: 'Excellent',
      seller: 'Bijita Manandhar',
      image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2f8?w=400&h=300&fit=crop',
      location: '28 kilo,dhulikhel'
    },
  
  ];

  const categories = [
    { id: 'all', name: 'All Stationery', icon: '📦' },
    { id: 'writing', name: 'Writing', icon: '✏️' },
    { id: 'notebooks', name: 'Notebooks', icon: '📓' },
    { id: 'drafting', name: 'Drafting Tools', icon: '📐' },
    { id: 'calculator', name: 'Calculators', icon: '🔢' },
    { id: 'paper', name: 'Paper Products', icon: '📄' },
    { id: 'supplies', name: 'Office Supplies', icon: '📎' }
  ];

  // Filter items
  const filteredItems = stationeryItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    
    let priceMatch = true;
    if (priceRange === 'under50') priceMatch = item.price < 300;
    else if (priceRange === '50-100') priceMatch = item.price >= 300 && item.price <= 700;
    else if (priceRange === '100-200') priceMatch = item.price >= 700 && item.price <= 1000;
    else if (priceRange === 'over200') priceMatch = item.price > 1000;
    return categoryMatch && priceMatch;
  });

   const handleBuyClick = (item) => {
    setSelectedItem(item);
    setShowBuyModal(true);
  };

  const handleBuyFormChange = (e) => {
    setBuyForm({
      ...buyForm,
      [e.target.name]: e.target.value
    });
  };

  const handleBuySubmit = async (e) => {
  e.preventDefault();
  if (!buyForm.name || !buyForm.email || !buyForm.location) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: buyForm.name,
        email: buyForm.email,
        location: buyForm.location,
        message: buyForm.message,
        productId: selectedItem.id // make sure this matches your backend Product._id
      })
    });

    const data = await res.json();

    if (data.success) {
      alert('Order placed successfully!');
      setBuyForm({ name: '', email: '', location: '', message: '' });
      setShowBuyModal(false);
      setSelectedItem(null);
    } else {
      alert('Error: ' + data.message);
    }

  } catch (err) {
    console.error(err);
    alert('Something went wrong while placing the order');
  }
};
  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name} added to cart!`);
  };
  
  return (
    <>
      <Navbar />
      <div className="stationery-page">
        {/* Header */}
        <div className="stationery-header">
          <div className="header-content">
            <h1>✏️ Stationery Marketplace</h1>
            <p>Find quality books, drafters, and stationery from fellow students</p>
          </div>
        </div>

        <div className="stationery-container">
          {/* Sidebar Filters */}
          <aside className="stationery-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className="category-icon">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-filters">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="price"
                    value="all"
                    checked={priceRange === 'all'}
                    onChange={(e) => setPriceRange(e.target.value)}
                  />
                  <span>All Prices</span>
                </label>
                <label className="radio-label">
                  <input
    type="radio"
    name="price"
    value="under50"
    checked={priceRange === 'under50'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Under Rs.300</span>
</label>
<label className="radio-label">
  <input
    type="radio"
    name="price"
    value="50-100"
    checked={priceRange === '50-100'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Rs.300 - Rs.700</span>
</label>
<label className="radio-label">
  <input
    type="radio"
    name="price"
    value="100-200"
    checked={priceRange === '100-200'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Rs.700 - Rs.1000</span>
</label>
<label className="radio-label">
  <input
    type="radio"
    name="price"
    value="over200"
    checked={priceRange === 'over200'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Over Rs.1000</span>
</label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="stationery-main">
            <div className="results-header">
              <h2>
                {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="results-count">({filteredItems.length} items)</span>
              </h2>
            </div>

            <div className="stationery-grid">
              {filteredItems.map(item => (
                <div key={item.id} className="stationery-card">
                  <div className="card-image">
                    <img src={item.image} alt={item.name} />
                    <span className="condition-badge">{item.condition}</span>
                  </div>
                  <div className="card-content">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">Rs.{item.price}</p>
                    <div className="item-meta">
                      <span className="seller">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        {item.seller}
                      </span>
                      <span className="location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {item.location}
                      </span>
                    </div>
                    
<div className="card-actions">
  <button className="btn-buy"onClick={() => handleBuyClick(item)}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
    Buy Now
  </button>
  <button className="btn-cart" onClick={() => handleAddToCart(item)} title="Add to Cart">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  </button>
</div>
                </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="no-results">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>No items found</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            )}
          </main>
        </div>
      </div>
  {/* Buy Modal */}
      {showBuyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Buy {selectedItem.name}</h2>
            <form onSubmit={handleBuySubmit}>
              <label>
                Your Name:
                <input
                  type="text"
                  name="name"
                  value={buyForm.name}
                  onChange={handleBuyFormChange}
                  required
                />
              </label>
              <label>
                Email Address:
                <input
                  type="email"
                  name="email"
                  value={buyForm.email}
                  onChange={handleBuyFormChange}
                  required
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  name="location"
                  value={buyForm.location}
                  onChange={handleBuyFormChange}
                  required
                />
              </label>
              <label>
                Message (optional):
                <textarea
                  name="message"
                  value={buyForm.message}
                  onChange={handleBuyFormChange}
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-confirm">Submit</button>
                <button type="button" className="btn-cancel" onClick={() => setShowBuyModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Stationery;
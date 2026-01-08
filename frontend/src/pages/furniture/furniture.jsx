import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom'; 
import Navbar from '../../Components/Navbar/Navbar';
import './Furniture.css';

const Furniture = () => {
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

  // Sample furniture data - replace with API call later
  const furnitureItems = [
  {
    id: 'furn-1',
    name: 'Study Desk',
    price: 800,
    category: 'desk',
    condition: 'Like New',
    seller: 'Bijita Manandhar',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
    location: '28 kilo,Dhulikhel'
  },
  {
    id: 'furn-2',
    name: 'Office Chair',
    price: 3500,
    category: 'chair',
    condition: 'Good',
    seller: 'Ritu Koju',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop',
    location: 'Buddha Park,28 kilo'
  },
  {
    id:'furn-3',
    name: 'Bookshelf',
    price: 5000,
    category: 'storage',
    condition: 'Excellent',
    seller: 'Meejala Lama',
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
    location: 'Ku gate,Dhulikhel'
  },
  {
    id: 'furn-4',
    name: 'Table Lamp',
    price: 399,
    category: 'Electronics',
    condition: 'Like New',
    seller: 'Sudha Karki',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
    location: 'Khadpu,Dhulikel'
  },
  {
    id:'furn-5',
    name: 'Low Bed',
    price: 9999,
    category: 'bed',
    condition: 'Good',
    seller: 'Swostika Manandhar',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
    location: 'Banepa, Kavre'
  },
  {
    id:'furn-6',
    name: 'Study Table',
    price: 800,
    category: 'Desk',
    condition: 'Good',
    seller: 'Kenij Manandhar',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    location: 'Campus A, Room 108'
  },
  {
    id: 'furn-7',
    name: 'Induction',
    price: 999,
    category: 'Electronics',
    condition: 'Excellent',
    seller: 'Riyaz Koju',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop',
    location: 'Campus C, Room 304'
  },
  {
    id: 'furn-8',
    name: 'Poartable Fan',
    price: 700,
    category: 'Electronics',
    condition: 'Like New',
    seller: 'Yurika Manandhar',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
    location: 'Campus B, Room 201'
  }
];

  const categories = [
    { id: 'all', name: 'All Furniture', icon: '🏠' },
    { id: 'desk', name: 'Desks', icon: '🪑' },
    { id: 'chair', name: 'Chairs', icon: '💺' },
    { id: 'storage', name: 'Storage', icon: '📦' },
    { id: 'electrical', name: 'Electrical', icon: '💡' },
    { id: 'bed', name: 'Beds', icon: '🛏️' }
  ];

  // Filter items
  const filteredItems = furnitureItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    
    let priceMatch = true;
if (priceRange === 'under500') priceMatch = item.price < 500;
else if (priceRange === '500-1000') priceMatch = item.price >= 500 && item.price <= 1000;
else if (priceRange === '1000-5000') priceMatch = item.price >= 1000 && item.price <= 5000;
else if (priceRange === 'over5000') priceMatch = item.price > 5000;
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
      <div className="furniture-page">
        {/* Header */}
        <div className="furniture-header">
          <div className="header-content">
            <h1>🪑 Furniture</h1>
            <p>Find quality pre-owned furniture from fellow students</p>
          </div>
        </div>

        <div className="furniture-container">
          {/* Sidebar Filters */}
          <aside className="furniture-sidebar">
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
    value="under500"
    checked={priceRange === 'under500'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Under Rs.500</span>
</label>
<label className="radio-label">
  <input
    type="radio"
    name="price"
    value="500-1000"
    checked={priceRange === '500-1000'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Rs.500 - Rs.1000</span>
</label>
<label className="radio-label">
  <input
    type="radio"
    name="price"
    value="1000-5000"
    checked={priceRange === '1000-5000'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Rs.1000 - Rs.5000</span>
</label>
<label className="radio-label">
  <input
    type="radio"
    name="price"
    value="over5000"
    checked={priceRange === 'over5000'}
    onChange={(e) => setPriceRange(e.target.value)}
  />
  <span>Over Rs.5000</span>
</label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="furniture-main">
            <div className="results-header">
              <h2>
                {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.name}
                <span className="results-count">({filteredItems.length} items)</span>
              </h2>
            </div>

<div className="furniture-grid">
  {filteredItems.map(item => (
    <div key={item.id} className="furniture-card">
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
          <button className="btn-buy" onClick={() => handleBuyClick(item)}>
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

<div className="card-actions">
  <button className="btn-buy" onClick={() => handleBuyClick(item)}>
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

export default Furniture;
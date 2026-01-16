import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";
import "./collection.css";

export default function Collection() {
  const [items, setItems] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [loading, setLoading] = useState(true);

  // BUY MODAL STATES
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [buyForm, setBuyForm] = useState({
    name: "",
    email: "",
    location: "",
    message: "",
  });

  const { addToCart } = useCart();

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch products error:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // PRICE FILTER
  const filteredItems = items.filter((item) => {
    if (priceRange === "all") return true;
    if (priceRange === "under500") return item.price < 500;
    if (priceRange === "500-1000") return item.price >= 500 && item.price <= 1000;
    if (priceRange === "1000-5000") return item.price >= 1000 && item.price <= 5000;
    if (priceRange === "over5000") return item.price > 5000;
    return true;
  });

  // BUY HANDLERS
  const handleBuyClick = (item) => {
    setSelectedItem(item);
    setShowBuyModal(true);
  };

  const handleBuyFormChange = (e) => {
    setBuyForm({ ...buyForm, [e.target.name]: e.target.value });
  };

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...buyForm,
          productId: selectedItem.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Order placed successfully!");
        setShowBuyModal(false);
        setBuyForm({ name: "", email: "", location: "", message: "" });
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  // CART
  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name} added to cart!`);
  };

  return (
    <>
      <Navbar />

      <div className="furniture-page">
        <header className="furniture-header">
          <div className="header-content">
            <h1>Stationery & Furniture Marketplace</h1>
            <p>Buy & resell gently-used stationery and furniture items</p>
          </div>
        </header>

        <div className="furniture-container">
          {/* SIDEBAR */}
          <aside className="furniture-sidebar">
            <div className="filter-section">
              <h3>Price Range</h3>
              <div className="price-filters-row">
                {[
                  { label: "All", value: "all" },
                  { label: "Under Rs.500", value: "under500" },
                  { label: "Rs.500 - Rs.1000", value: "500-1000" },
                  { label: "Rs.1000 - Rs.5000", value: "1000-5000" },
                  { label: "Over Rs.5000", value: "over5000" },
                ].map((p) => (
                  <button
                    key={p.value}
                    className={`price-btn ${priceRange === p.value ? "active" : ""}`}
                    onClick={() => setPriceRange(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          
          <main className="furniture-main">
            {loading ? (
              <div className="no-results">Loading products...</div>
            ) : filteredItems.length === 0 ? (
              <div className="no-results">No items found.</div>
            ) : (
              <div className="furniture-grid">
                {filteredItems.map((item) => (
                  <div key={item.id} className="furniture-card">
                    <div className="card-image">
  {item.image ? (
    <img src={item.image} alt={item.name} />
  ) : (
    <div className="no-image">No Image</div>
  )}
</div>


                    <div className="card-content">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">Rs.{item.price}</p>

                      {item.condition && (
                        <span className={`condition-badge ${item.condition.toLowerCase()}`}>
                          {item.condition}
                        </span>
                      )}

                      <div className="item-meta">
                        <span>👤 {item.seller}</span>
                        {item.location && <span>📍 {item.location}</span>}
                        <span>📦 {item.category}</span>
                      </div>

                      <div className="card-actions">
                        <button className="btn-buy" onClick={() => handleBuyClick(item)}>
                          Buy Now
                        </button>
                        <button className="btn-cart" onClick={() => handleAddToCart(item)}>
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

{showBuyModal && selectedItem && (
  <div className="modal-overlay">
    <div className="modal-content buy-modal">
      <button 
        className="modal-close"
        onClick={() => setShowBuyModal(false)}
        aria-label="Close modal"
      >
        ✕
      </button>
      
      <div className="modal-layout">
       
        <div className="modal-product-preview">
          <div className="product-image-container">
            <img 
              src={selectedItem.image} 
              alt={selectedItem.name}
              className="product-preview-image"
            />
            <div className="product-badge">{selectedItem.category}</div>
          </div>
          
          <div className="product-details">
            <h2 className="product-title">{selectedItem.name}</h2>
            <p className="product-description">{selectedItem.description}</p>
            
            <div className="product-info-grid">
              <div className="info-item">
                <span className="info-label">Price</span>
                <span className="info-value price">NPR {selectedItem.price.toLocaleString()}</span>
              </div>
              
              {selectedItem.location && (
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-value">{selectedItem.location}</span>
                </div>
              )}
              
              {selectedItem.condition && (
                <div className="info-item">
                  <span className="info-label">Condition</span>
                  <span className="info-value">{selectedItem.condition}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        
        <div className="modal-form-section">
          <div className="form-header">
            <h3>Contact Seller</h3>
            <p className="form-subtitle">Fill in your details to express interest</p>
          </div>
          
          <form onSubmit={handleBuySubmit} className="buy-form">
            <div className="form-group">
              <label htmlFor="buyer-name">Your Name *</label>
              <input
                id="buyer-name"
                name="name"
                placeholder="Enter your full name"
                value={buyForm.name}
                onChange={handleBuyFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="buyer-email">Contact Number *</label>
              <input
                id="buyer-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={buyForm.email}
                onChange={handleBuyFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="buyer-location">Your Location *</label>
              <input
                id="buyer-location"
                name="location"
                placeholder="Place around University"
                value={buyForm.location}
                onChange={handleBuyFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="buyer-message">Message (Optional)</label>
              <textarea
                id="buyer-message"
                name="message"
                placeholder="Any questions or additional information..."
                value={buyForm.message}
                onChange={handleBuyFormChange}
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button type="submit" className="btn-confirm">
                <span className="btn-icon">💵</span>
                Buy 
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowBuyModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
      
    </>
  );
}

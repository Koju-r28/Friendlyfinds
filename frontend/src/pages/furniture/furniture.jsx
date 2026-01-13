import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Navbar from "../../Components/Navbar/Navbar";
import "./Furniture.css";

const Furniture = () => {
  const [items, setItems] = useState([]);
  const [priceRange, setPriceRange] = useState("all");

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

  // FETCH FURNITURE
  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products?category=Furniture"
        );
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFurniture();
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
        body: JSON.stringify({ ...buyForm, productId: selectedItem.id }),
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
                ].map((price) => (
                  <button
                    key={price.value}
                    className={`price-btn ${priceRange === price.value ? "active" : ""}`}
                    onClick={() => setPriceRange(price.value)}
                  >
                    {price.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN GRID */}
          <main className="furniture-main">
            <div className="furniture-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="furniture-card">
                  <div className="card-image">
                    <img src={item.image} alt={item.name} />
                    <span className="condition-badge">{item.condition}</span>
                  </div>
                  <div className="card-content">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">Rs.{item.price}</p>
                    <div className="item-meta">
                      <span>👤 {item.seller}</span>
                      <span>📍 {item.location}</span>
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
          </main>
        </div>
      </div>

      {/* BUY MODAL */}
      {showBuyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Buy {selectedItem.name}</h2>
            <form onSubmit={handleBuySubmit}>
              <input
                name="name"
                placeholder="Your Name"
                value={buyForm.name}
                onChange={handleBuyFormChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={buyForm.email}
                onChange={handleBuyFormChange}
                required
              />
              <input
                name="location"
                placeholder="Location"
                value={buyForm.location}
                onChange={handleBuyFormChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message (optional)"
                value={buyForm.message}
                onChange={handleBuyFormChange}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-confirm">
                  Submit
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
      )}
    </>
  );
};

export default Furniture;  
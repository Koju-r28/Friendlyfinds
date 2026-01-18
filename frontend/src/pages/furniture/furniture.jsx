import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./Furniture.css";

const Furniture = () => {
  const { addToCart } = useCart();
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [buyForm, setBuyForm] = useState({
    name: "",
    email: "",
    location: "",
    message: "",
  });

  // Fetch all products for cross-page search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);
        // Filter furniture items only
        const furnitureItems = (Array.isArray(data) ? data : []).filter(
          (item) => item.category.toLowerCase() === "furniture"
        );
        setItems(furnitureItems);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Cross-page search redirection
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) return;

    const firstMatch = allProducts.find((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (firstMatch) {
      const category = firstMatch.category?.toLowerCase();
      if (category === "furniture") {
        navigate("/furniture");
      } else if (category === "stationery") {
        navigate("/stationery");
      }
    }
  }, [searchQuery, allProducts, navigate]);

  // Filter by price + search query
  const filteredItems = items.filter((item) => {
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "under500" && item.price < 500) ||
      (priceRange === "500-1000" && item.price >= 500 && item.price <= 1000) ||
      (priceRange === "1000-5000" && item.price >= 1000 && item.price <= 5000) ||
      (priceRange === "over5000" && item.price > 5000);

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPrice && matchesSearch;
  });

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
        body: JSON.stringify({ ...buyForm, productId: selectedItem._id }),
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
            <h1>Furniture Marketplace</h1>
            <p>Find quality pre-owned furniture from fellow students</p>
          </div>
        </header>

        <div className="furniture-container">
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
                    className={`price-btn ${
                      priceRange === price.value ? "active" : ""
                    }`}
                    onClick={() => setPriceRange(price.value)}
                  >
                    {price.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="furniture-main">
            {filteredItems.length === 0 ? (
              <p className="no-results">No furniture found.</p>
            ) : (
              <div className="furniture-grid">
                {filteredItems.map((item) => (
                  <div key={item._id} className="furniture-card">
                    <div className="card-image">
                      <img src={item.image} alt={item.name} />
                      {item.condition && (
                        <span className="condition-badge">{item.condition}</span>
                      )}
                    </div>
                    <div className="card-content">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price">Rs. {item.price}</p>
                      <div className="item-meta">
                        <span>👤 {item.seller}</span>
                        <span>📍 {item.location}</span>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn-buy"
                          onClick={() => handleBuyClick(item)}
                        >
                          Buy Now
                        </button>
                        <button
                          className="btn-cart"
                          onClick={() => handleAddToCart(item)}
                        >
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
            >
              ✕
            </button>
            <div className="modal-layout">
              <div className="modal-product-preview">
                <img src={selectedItem.image} alt={selectedItem.name} />
                <h2>{selectedItem.name}</h2>
                <p className="price">NPR {selectedItem.price.toLocaleString()}</p>
                <p>{selectedItem.description}</p>
              </div>
              <form onSubmit={handleBuySubmit} className="buy-form">
                <input
                  name="name"
                  placeholder="Your Name"
                  value={buyForm.name}
                  onChange={handleBuyFormChange}
                  required
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={buyForm.email}
                  onChange={handleBuyFormChange}
                  required
                />
                <input
                  name="location"
                  placeholder="Your Location"
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
                <button type="submit">Confirm Purchase</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Furniture;

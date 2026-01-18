import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import Navbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "./Stationery.css";

const Stationery = () => {
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
  const [loading, setLoading] = useState(false);

  // Fetch all products for cross-page search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);

        // Filter stationery items only
        const stationeryItems = (Array.isArray(data) ? data : []).filter(
          (item) => item.category?.toLowerCase() === "stationery"
        );
        setItems(stationeryItems);
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
      if (category === "stationery") {
        navigate("/stationery");
      } else if (category === "furniture") {
        navigate("/furniture");
      }
    }
  }, [searchQuery, allProducts, navigate]);

  // Filter by price + search query
  const filteredItems = items.filter((item) => {
    const price = Number(item.price);

    const priceMatch =
      priceRange === "all" ||
      (priceRange === "under500" && price < 500) ||
      (priceRange === "500-1000" && price >= 500 && price <= 1000) ||
      (priceRange === "1000-5000" && price >= 1000 && price <= 5000) ||
      (priceRange === "over5000" && price > 5000);

    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return priceMatch && searchMatch;
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

    if (!buyForm.name || !buyForm.email || !buyForm.location) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        productId: selectedItem._id || selectedItem.id,
        productName: selectedItem.title || selectedItem.name,
        productImage: selectedItem.image,
        price: parseFloat(selectedItem.price),
        quantity: 1,
        sellerId: selectedItem.sellerId || null,
        sellerName: selectedItem.seller || "Unknown Seller",
        buyerName: buyForm.name,
        buyerEmail: buyForm.email,
        buyerLocation: buyForm.location,
        message: buyForm.message || "",
        buyerId: null,
      };

      const res = await fetch("http://localhost:5000/api/orders/direct-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server returned ${res.status}: ${errorText}`);
      }

      const data = await res.json();

      if (data.success) {
        alert(`Order placed successfully! Order ID: ${data.data.orderId}`);

        setItems((prevItems) =>
          prevItems.filter((item) => (item._id || item.id) !== (selectedItem._id || selectedItem.id))
        );

        setShowBuyModal(false);
        setBuyForm({ name: "", email: "", location: "", message: "" });
        setSelectedItem(null);
      } else {
        alert(data.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Direct purchase error:", err);
      alert(`Failed to place order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // CART
  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.name || item.title} added to cart!`);
  };

  return (
    <>
      <Navbar />

      <div className="stationery-page">
        <header className="stationery-header">
          <div className="header-content">
            <h1>Stationery Marketplace</h1>
            <p>Find quality books, drafters, and stationery from fellow students</p>
          </div>
        </header>

        <div className="stationery-container">
          {/* SIDEBAR */}
          <aside className="stationery-sidebar">
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
          <main className="stationery-main">
            {filteredItems.length === 0 ? (
              <p style={{ padding: "2rem" }}>No items found.</p>
            ) : (
              <div className="stationery-grid">
                {filteredItems.map((item) => (
                  <div key={item._id || item.id} className="stationery-card">
                    <div className="card-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      {item.condition && <span className="condition-badge">{item.condition}</span>}
                    </div>

                    <div className="card-content">
                      <h3 className="item-name">{item.title || item.name}</h3>
                      <p className="item-price">Rs.{item.price}</p>

                      <div className="item-meta">
                        <span>👤 {item.seller || "Unknown"}</span>
                        {(item.location || item.address) && (
                          <span>📍 {item.location || item.address}</span>
                        )}
                        {item.category && <span>📦 {item.category}</span>}
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

      {/* BUY MODAL */}
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
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title || selectedItem.name}
                  className="product-preview-image"
                />
                <h2>{selectedItem.title || selectedItem.name}</h2>
                <p>NPR {selectedItem.price}</p>
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
                  <button type="submit" disabled={loading}>
                    {loading ? "Placing Order..." : "Buy"}
                  </button>
                  <button type="button" onClick={() => setShowBuyModal(false)} disabled={loading}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stationery;

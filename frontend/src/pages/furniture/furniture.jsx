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

  // BUY MODAL STATES
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [buyForm, setBuyForm] = useState({
    name: "",
    email: "",
    location: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);

        const furnitureItems = (Array.isArray(data) ? data : []).filter(
          (item) => item.category?.toLowerCase() === "furniture"
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

      const res = await fetch(
        "http://localhost:5000/api/orders/direct-purchase",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        alert(`Order placed successfully! Order ID: ${data.data.orderId}`);

        // Remove product from display
        setItems((prevItems) =>
          prevItems.filter(
            (item) => (item._id || item.id) !== (selectedItem._id || selectedItem.id)
          )
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

  // CART HANDLER
  const handleAddToCart = (item) => {
    addToCart(item);
    alert(`${item.title || item.name} added to cart!`);
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
                  <div key={item._id || item.id} className="furniture-card">
                    <div className="card-image">
                      <img src={item.image} alt={item.title || item.name} />
                      {item.condition && (
                        <span className="condition-badge">{item.condition}</span>
                      )}
                    </div>
                    <div className="card-content">
                      <h3 className="item-name">{item.title || item.name}</h3>
                      <p className="item-price">Rs. {item.price}</p>
                      <div className="item-meta">
                        <span>👤 {item.seller}</span>
                        <span>📍 {item.address || item.location}</span>
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

      {/* BUY MODAL */}
      {showBuyModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Buy {selectedItem.title || selectedItem.name}</h2>
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
                <button type="submit" className="btn-confirm" disabled={loading}>
                  {loading ? "Placing Order..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowBuyModal(false)}
                  disabled={loading}
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

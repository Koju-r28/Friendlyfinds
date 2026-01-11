import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';
import './checkout.css';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    campus: '',
    pickupDate: '',
    pickupTime: '',
    notes: ''
  });

  const total = getCartTotal();

  // Group items by seller
  const groupedBySeller = cartItems.reduce((acc, item) => {
    const seller = item.seller || 'Unknown Seller';
    if (!acc[seller]) {
      acc[seller] = [];
    }
    acc[seller].push(item);
    return acc;
  }, {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          seller: item.seller,
          image: item.image
        })),
        totalAmount: total,
        buyerInfo: formData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert('Order placed successfully! The sellers will contact you shortly.');
        clearCart();
        navigate('/furniture');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Navbar />
      
      <div className="checkout-page">
        <div className="checkout-hero">
          <h1 className="checkout-hero-title">Checkout</h1>
          <p className="checkout-hero-subtitle">Complete your order</p>
        </div>

        <div className="checkout-container">
          <div className="checkout-grid">
            {/* Buyer Information Form */}
            <div className="checkout-form-section">
              <button className="back-button" onClick={() => navigate('/cart')}>
                <span>←</span> Back to Cart
              </button>

              <div className="checkout-form-card">
                <h2>Buyer Information</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-section">
                    <h3>Contact Information</h3>
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+977 9800000000"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Pickup Details</h3>
                    <div className="form-group">
                      <label htmlFor="campus">Campus Location *</label>
                      <select
                        id="campus"
                        name="campus"
                        required
                        value={formData.campus}
                        onChange={handleInputChange}
                      >
                        <option value="">Select campus location</option>
                        <option value="main">Main Campus</option>
                        <option value="library">Library Building</option>
                        <option value="cafeteria">Cafeteria Area</option>
                        <option value="sports">Sports Complex</option>
                      </select>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="pickupDate">Preferred Date *</label>
                        <input
                          type="date"
                          id="pickupDate"
                          name="pickupDate"
                          required
                          min={today}
                          value={formData.pickupDate}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="pickupTime">Preferred Time *</label>
                        <input
                          type="time"
                          id="pickupTime"
                          name="pickupTime"
                          required
                          value={formData.pickupTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>Sellers You'll Meet</h3>
                    {Object.entries(groupedBySeller).map(([seller, items], index) => (
                      <div key={seller} className="seller-info">
                        <div className="seller-info-title">Seller {index + 1}</div>
                        <div className="seller-name">{seller}</div>
                        <div className="seller-items">
                          Items: {items.map(item => item.name).join(', ')} ({items.length} {items.length === 1 ? 'item' : 'items'})
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="form-section">
                    <h3>Additional Notes</h3>
                    <div className="form-group">
                      <label htmlFor="notes">Special Instructions (Optional)</label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special requests or notes for the sellers..."
                      />
                    </div>
                  </div>

                  <button type="submit" className="confirm-button">
                    Confirm Order - Rs.{total.toFixed(2)}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="checkout-summary-section">
              <div className="checkout-summary-card">
                <h2>Order Summary</h2>

                <div className="summary-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="summary-item">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="summary-item-image"
                      />
                      <div className="summary-item-details">
                        <div className="summary-item-name">{item.name}</div>
                        <div className="summary-item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="summary-item-price">
                        Rs.{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">Rs.{total.toFixed(2)}</span>
                </div>

                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-amount">Rs.{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
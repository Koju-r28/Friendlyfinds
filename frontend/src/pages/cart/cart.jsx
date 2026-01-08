import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';
import './cart.css';

const Cart = () => {
  const { logout, user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <>
      <Navbar />
      
      <div className="cart-container">
        <div className="cart-content">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            <h1 className="cart-title">Shopping Cart</h1>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p className="empty-cart-text">Your cart is empty</p>
                <Link to="/furniture" className="continue-shopping-btn">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="item-details">
                      <div className="item-header">
                        <div className="item-info">
                          <h3 className="item-name">{item.name}</h3>
                          <p className="item-category">{item.category}</p>
                          <p className="item-seller">Seller: {item.seller}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-btn"
                          aria-label="Remove item"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="item-footer">
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="quantity-btn"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="quantity-value">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="quantity-btn"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="item-price">
                          <p className="price-total">
                            Rs.{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="price-each">Rs.{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="order-summary-section">
            <div className="order-summary">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>Rs.{subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>Rs.{tax.toFixed(2)}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span className="total-amount">Rs.{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0}
                className="checkout-btn"
              >
                Proceed to Checkout
              </button>

              <Link to="/furniture" className="continue-btn">
                Continue Shopping
              </Link>

              <div className="campus-pickup-info">
                <p>
                  <span className="info-highlight">Campus Pickup Available!</span>
                  <br />
                  Meet sellers safely on campus locations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';
import './cart.css';

const Cart = () => {
  const { logout, user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const total = getCartTotal();

  return (
    <>
      <Navbar />
      
      <div className="cart-page">
        <div className="cart-wrapper">
          {/* Cart Items Section */}
          <div className="cart-left">
            <h1 className="cart-heading">Shopping Cart</h1>

            {cartItems.length === 0 ? (
              <div className="empty-cart-box">
                <div className="empty-icon">🛒</div>
                <p className="empty-text">Your cart is empty</p>
                <Link to="/furniture" className="shop-btn">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="items-list">
                {cartItems.map(item => (
                  <div key={item.id} className="product-card">
                    <div className="product-img-box">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="product-info">
                      <div className="info-top">
                        <div>
                          <h3 className="product-title">{item.name}</h3>
                          <p className="product-cat">{item.category}</p>
                          <p className="product-seller">Seller: {item.seller}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="delete-btn"
                          title="Remove"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="info-bottom">
                        <div className="qty-box">
                          <button onClick={() => updateQuantity(item.id, -1)} className="qty-btn">−</button>
                          <span className="qty-num">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="qty-btn">+</button>
                        </div>
                        <div className="price-box">
                          <div className="main-price">Rs.{(item.price * item.quantity).toFixed(2)}</div>
                          <div className="unit-price">Rs.{item.price.toFixed(2)} each</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="cart-right">
            <div className="summary-box">
              <h2 className="summary-heading">Order Summary</h2>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>Rs.{total.toFixed(2)}</span>
                </div>
                <div className="summary-total-row">
                  <span>Total</span>
                  <span className="total-price">Rs.{total.toFixed(2)}</span>
                </div>
              </div>

              <button disabled={cartItems.length === 0} className="checkout-button">
                Proceed to Checkout
              </button>

              <Link to="/furniture" className="continue-button">
                Continue Shopping
              </Link>

              <div className="pickup-box">
                <p>
                  <strong>Campus Pickup Available!</strong><br />
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
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

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      // Prepare order data
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
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('http://localhost:5000/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        alert('Order placed successfully!');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="cart-page">

        <div className="cart-hero">
          <h1 className="cart-hero-title">Shopping Cart</h1>
          <p className="cart-hero-subtitle">Review and manage your items</p>
        </div>

        <div className="cart-wrapper">

          <div className="cart-left">
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

              <button 
                disabled={cartItems.length === 0} 
                className="checkout-button"
                onClick={handleCheckout}
              >
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
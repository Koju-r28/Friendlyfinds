// api.js - Frontend API service

const API_URL = 'http://localhost:3000/api';

// Get cart
export const getCart = async (userId) => {
  const response = await fetch(`${API_URL}/cart/${userId}`);
  return response.json();
};

// Add to cart
export const addToCart = async (userId, item) => {
  const response = await fetch(`${API_URL}/cart/${userId}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
};

// Remove from cart
export const removeFromCart = async (userId, itemId) => {
  const response = await fetch(`${API_URL}/cart/${userId}/remove/${itemId}`, {
    method: 'DELETE'
  });
  return response.json();
};

// Update quantity
export const updateCartItem = async (userId, itemId, quantity) => {
  const response = await fetch(`${API_URL}/cart/${userId}/update/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });
  return response.json();
};

// Clear cart
export const clearCart = async (userId) => {
  const response = await fetch(`${API_URL}/cart/${userId}/clear`, {
    method: 'DELETE'
  });
  return response.json();
};

// Get all items
export const getItems = async () => {
  const response = await fetch(`${API_URL}/items`);
  return response.json();
};
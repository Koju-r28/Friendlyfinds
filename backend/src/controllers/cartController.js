const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// Add item to cart
const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // Find user's cart or create new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({ userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Product already in cart, update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    
    // Populate product details before returning
    await cart.populate('items.productId');

    return { 
      success: true, 
      message: 'Item added to cart', 
      cart 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error adding to cart', 
      error: error.message 
    };
  }
};

// Get user's cart
const getCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId })
      .populate('items.productId');

    if (!cart) {
      return { 
        success: true, 
        cart: { items: [] } 
      };
    }

    return { 
      success: true, 
      cart 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error fetching cart', 
      error: error.message 
    };
  }
};

// Update item quantity in cart
const updateCartItem = async (userId, productId, quantity) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return { 
        success: false, 
        message: 'Cart not found' 
      };
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return { 
        success: false, 
        message: 'Item not found in cart' 
      };
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.productId');

    return { 
      success: true, 
      message: 'Cart updated', 
      cart 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error updating cart', 
      error: error.message 
    };
  }
};

// Remove item from cart
const removeFromCart = async (userId, productId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return { 
        success: false, 
        message: 'Cart not found' 
      };
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.productId');

    return { 
      success: true, 
      message: 'Item removed from cart', 
      cart 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error removing item', 
      error: error.message 
    };
  }
};

// Clear entire cart
const clearCart = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return { 
        success: false, 
        message: 'Cart not found' 
      };
    }

    cart.items = [];
    await cart.save();

    return { 
      success: true, 
      message: 'Cart cleared', 
      cart 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Error clearing cart', 
      error: error.message 
    };
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
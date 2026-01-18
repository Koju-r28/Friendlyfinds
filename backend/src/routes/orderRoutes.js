// File: src/routes/orderRoutes.js
// Clean version with minimal logging

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  orderType: {
    type: String,
    enum: ['direct_purchase', 'cart_checkout'],
    required: true
  },
  buyerInfo: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  sellers: [{
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    sellerName: String,
    items: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      productName: String,
      productImage: String,
      quantity: {
        type: Number,
        default: 1
      },
      price: Number,
      subtotal: Number
    }],
    sellerSubtotal: Number,
    sellerStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    }
  }],
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'card', 'wallet', 'bank_transfer'],
    default: 'cash_on_delivery'
  },
  specialInstructions: String,
  message: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// POST: Direct Purchase
router.post('/direct-purchase', async (req, res) => {
  try {
    const { 
      productId, productName, productImage, price, quantity = 1,
      sellerId, sellerName, buyerName, buyerEmail, buyerLocation,
      message, buyerId
    } = req.body;

    if (!productId || !productName || !price || !buyerName || !buyerEmail || !buyerLocation) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const subtotal = parseFloat(price) * parseInt(quantity);

    const newOrder = new Order({
      orderId,
      orderType: 'direct_purchase',
      buyerInfo: { name: buyerName, email: buyerEmail, location: buyerLocation },
      buyerId: buyerId || null,
      totalAmount: subtotal,
      sellers: [{
        sellerId: sellerId || null,
        sellerName: sellerName || 'Unknown Seller',
        items: [{
          productId, productName, productImage: productImage || '',
          quantity: parseInt(quantity), price: parseFloat(price), subtotal
        }],
        sellerSubtotal: subtotal,
        sellerStatus: 'pending'
      }],
      message: message || '',
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending'
    });

    const savedOrder = await newOrder.save();

    // Delete product from database
    try {
      const Product = mongoose.model('Product');
      await Product.findByIdAndDelete(productId);
    } catch (deleteError) {
      console.error('Error deleting product:', deleteError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: savedOrder.orderId,
        orderType: savedOrder.orderType,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        orderDate: savedOrder.orderDate
      }
    });

  } catch (error) {
    console.error('Direct purchase error:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.'
    });
  }
});

// POST: Cart Checkout
router.post('/cart-checkout', async (req, res) => {
  try {
    const { 
      sellers, totalAmount, buyerName, buyerEmail, buyerLocation,
      buyerId, shippingAddress, paymentMethod, specialInstructions 
    } = req.body;

    if (!sellers || !totalAmount || !buyerName || !buyerEmail || !buyerLocation) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!Array.isArray(sellers) || sellers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one seller with items is required'
      });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const productIdsToDelete = [];
    const processedSellers = sellers.map(seller => {
      const sellerSubtotal = seller.items.reduce((sum, item) => {
        productIdsToDelete.push(item.productId);
        return sum + (item.price * item.quantity);
      }, 0);

      return {
        sellerId: seller.sellerId || null,
        sellerName: seller.sellerName || 'Unknown Seller',
        items: seller.items.map(item => ({
          productId: item.productId,
          productName: item.productName || item.name,
          productImage: item.productImage || item.image,
          quantity: item.quantity || 1,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.price) * (item.quantity || 1)
        })),
        sellerSubtotal,
        sellerStatus: 'pending'
      };
    });

    const newOrder = new Order({
      orderId,
      orderType: 'cart_checkout',
      buyerInfo: { name: buyerName, email: buyerEmail, location: buyerLocation },
      buyerId: buyerId || null,
      totalAmount: parseFloat(totalAmount),
      sellers: processedSellers,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'cash_on_delivery',
      specialInstructions: specialInstructions || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    const savedOrder = await newOrder.save();

    // Delete all purchased products
    try {
      const Product = mongoose.model('Product');
      await Product.deleteMany({ _id: { $in: productIdsToDelete } });
    } catch (deleteError) {
      console.error('Error deleting products:', deleteError.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: savedOrder.orderId,
        orderType: savedOrder.orderType,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        orderDate: savedOrder.orderDate
      }
    });

  } catch (error) {
    console.error('Cart checkout error:', error.message);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to place order. Please try again.'
    });
  }
});

// GET: Fetch order by ID
router.get('/order/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('buyerId', 'name email phone')
      .populate('sellers.sellerId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// GET: Fetch orders by buyer
router.get('/buyer/orders', async (req, res) => {
  try {
    const { email, buyerId, page = 1, limit = 10 } = req.query;

    let query = {};
    if (buyerId) {
      query.buyerId = buyerId;
    } else if (email) {
      query['buyerInfo.email'] = email;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Email or buyerId is required'
      });
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// GET: Fetch orders by seller
router.get('/seller/:sellerId/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const orders = await Order.find({ 'sellers.sellerId': req.params.sellerId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments({ 'sellers.sellerId': req.params.sellerId });

    return res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// GET: All orders (admin)
router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments();

    return res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalOrders: count
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('../models/notificationModel');
const Product = require('../models/productModel');
const User = require('../models/user');

// Order Schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  orderType: { type: String, enum: ['direct_purchase', 'cart_checkout'], required: true },
  buyerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true }
  },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  orderDate: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending' },
  sellers: [{
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sellerName: String,
    items: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      productImage: String,
      quantity: { type: Number, default: 1 },
      price: Number,
      subtotal: Number
    }],
    sellerSubtotal: Number,
    sellerStatus: { type: String, enum: ['pending','confirmed','processing','shipped','delivered','cancelled'], default: 'pending' }
  }],
  message: String,
  paymentMethod: { type: String, enum: ['cash_on_delivery','card','wallet','bank_transfer'], default: 'cash_on_delivery' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

// ===== DIRECT PURCHASE =====
router.post('/direct-purchase', async (req, res) => {
  try {
    const { productId, productName, productImage, price, quantity = 1, sellerId, sellerName, buyerName, buyerEmail, buyerLocation, message, buyerId } = req.body;

    if (!productId || !productName || !price || !buyerName || !buyerEmail || !buyerLocation) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2,9).toUpperCase()}`;
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
        items: [{ productId, productName, productImage: productImage || '', quantity: parseInt(quantity), price: parseFloat(price), subtotal }],
        sellerSubtotal: subtotal,
        sellerStatus: 'pending'
      }],
      message: message || '',
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending'
    });

    const savedOrder = await newOrder.save();

    // Create notification for seller
    if (sellerId) {
      await Notification.create({
        userId: sellerId,
        message: `New order received for "${productName}" from ${buyerName}`
      });
    }

    // Delete product from database
    try { await Product.findByIdAndDelete(productId); } 
    catch (err) { console.error('Error deleting product:', err.message); }

    res.status(201).json({
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
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// ===== CART CHECKOUT =====
router.post('/cart-checkout', async (req, res) => {
  try {
    const { sellers, totalAmount, buyerName, buyerEmail, buyerLocation, buyerId } = req.body;

    if (!sellers || sellers.length === 0 || !totalAmount || !buyerName || !buyerEmail || !buyerLocation) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2,9).toUpperCase()}`;

    const productIdsToDelete = [];
    const processedSellers = sellers.map(seller => {
      const sellerSubtotal = seller.items.reduce((sum, item) => {
        productIdsToDelete.push(item.productId);
        return sum + (item.price * item.quantity);
      },0);

      return {
        sellerId: seller.sellerId || null,
        sellerName: seller.sellerName || 'Unknown Seller',
        items: seller.items.map(item => ({
          productId: item.productId,
          productName: item.productName || item.name,
          productImage: item.productImage || item.image,
          quantity: item.quantity || 1,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.price)*(item.quantity||1)
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
      status: 'pending',
      paymentStatus: 'pending'
    });

    const savedOrder = await newOrder.save();

    // Create notifications for all sellers
    for (const seller of processedSellers) {
      if (seller.sellerId) {
        await Notification.create({
          userId: seller.sellerId,
          message: `New order received with ${seller.items.length} item(s) from ${buyerName}`
        });
      }
    }

    // Delete purchased products
    try { await Product.deleteMany({ _id: { $in: productIdsToDelete } }); } 
    catch (err) { console.error('Error deleting products:', err.message); }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { orderId: savedOrder.orderId, totalAmount: savedOrder.totalAmount }
    });

  } catch (error) {
    console.error('Cart checkout error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

module.exports = router;

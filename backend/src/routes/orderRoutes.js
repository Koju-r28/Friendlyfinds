const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getPurchaseHistory, 
  getSellingHistory,
  cancelOrder 
} = require('../controllers/orderController');

// Create order (buy product)
router.post('/create', async (req, res) => {
  try {
    const { buyerId, sellerId, productId, price } = req.body;
    
    const result = await createOrder(buyerId, sellerId, productId, Number(price));
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get purchase history (what user bought)
router.get('/purchases/:buyerId', async (req, res) => {
  try {
    const { buyerId } = req.params;
    const result = await getPurchaseHistory(buyerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get selling history (what user sold)
router.get('/sales/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await getSellingHistory(sellerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel order
router.patch('/cancel/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await cancelOrder(orderId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderControllers');

// POST /api/orders -> place a new order
router.post('/', createOrder);

module.exports = router;

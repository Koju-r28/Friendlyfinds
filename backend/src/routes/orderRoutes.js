const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');

// CREATE ORDER
router.post('/create', createOrder);

module.exports = router;

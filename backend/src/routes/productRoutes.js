const express = require('express');
const router = express.Router();

// Product routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all products' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create product' });
});

module.exports = router;
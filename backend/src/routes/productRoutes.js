const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

router.post('/', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json({ product });
});

router.get('/', async (req, res) => {
  const { sellerId } = req.query;
  const products = await Product.find({ sellerId });
  res.json(products);
});

router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

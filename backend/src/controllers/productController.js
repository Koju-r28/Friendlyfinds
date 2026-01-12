// backend/src/controllers/productControllers.js
const Product = require('../models/productModel');

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { title, price, address, category, sellerId, condition, description, stock, image } = req.body;

    if (!title || !price || !address || !category || !sellerId || !condition || !description || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      title,
      price,
      address,
      category,
      sellerId,
      condition,
      description,
      stock,
      image: image || ""
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get products for a seller
exports.getProducts = async (req, res) => {
  try {
    const { sellerId } = req.query;
    if (!sellerId) return res.status(400).json({ message: "sellerId required" });

    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

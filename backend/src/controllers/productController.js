const Product = require("../models/productModel");

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const { title, price, description, category, condition, sellerId, stock, address } = req.body;

    if (!title || !price || !description || !category || !condition || !sellerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let image = null;
    if (req.file) {
      image = req.file.filename; // filename saved by Multer
    }

    const product = new Product({
      title,
      price,
      description,
      category,
      condition,
      stock,
      address,
      sellerId,
      image
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET PRODUCTS BY SELLER
exports.getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Fetch seller products error:", err);
    res.status(500).json([]);
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

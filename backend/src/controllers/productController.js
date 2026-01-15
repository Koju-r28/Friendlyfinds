const Product = require("../models/productModel");
const User = require("../models/user"); // needed for getProductsByCategory

// ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    const { title, price, description, category, condition, sellerId, stock, address } = req.body;

    if (!title || !price || !description || !category || !condition || !sellerId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let image = null;
    if (req.file) {
    image = `/uploads/${req.file.filename}`;
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

// GET PRODUCTS BY CATEGORY (with optional seller filter)
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category, sellerId } = req.query; // <-- optional sellerId

    const query = {};
    if (category) query.category = category;
    if (sellerId) query.sellerId = sellerId; // only fetch for this seller

    const products = await Product.find(query);

    const productsWithSeller = await Promise.all(
      products.map(async (p) => {
        const user = await User.findById(p.sellerId);
        return {
          id: p._id,
          name: p.title,
          price: p.price,
          image: p.image,
          condition: p.condition,
          seller: user ? user.username : "Unknown",
          location: p.address,
          category: p.category,
          sellerId: p.sellerId, // send this too for frontend delete checks
        };
      })
    );

    res.json(productsWithSeller);
  } catch (err) {
    console.error("Get products by category error:", err);
    res.status(500).json({ message: err.message });
  }
};

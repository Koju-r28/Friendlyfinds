const Product = require("../models/productModel");
const User = require("../models/user"); 
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const products = await Product.find(query);

    // Map sellerId → username
    const productsWithSeller = await Promise.all(
      products.map(async (p) => {
        const user = await User.findById(p.sellerId);
        return {
          id: p._id,
          name: p.title,
          price: p.price,
          image: p.image,
          condition: p.condition,
          seller: user ? user.username : "Unknown", // ✅ username instead of ID
          location: p.address,
          category: p.category,
        };
      })
    );

    res.json(productsWithSeller);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProductsByCategory };

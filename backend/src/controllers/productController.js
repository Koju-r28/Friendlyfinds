const Product = require("../models/productModel");
const User = require("../models/user"); 
const getProductsByCategory = async (req, res) => {
  try {
    const { category, sellerId } = req.query; // <-- new sellerId query

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
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProductsByCategory };

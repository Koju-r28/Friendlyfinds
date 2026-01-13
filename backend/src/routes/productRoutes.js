const express = require("express");
const router = express.Router();
const { getProductsByCategory } = require("../controllers/productController");
const Product = require("../models/productModel");

/* ADD PRODUCT (SELLER) */
router.post("/", async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      price: req.body.price,
      address: req.body.address,
      category: req.body.category, // Furniture / Stationery
      sellerId: req.body.sellerId, // logged-in user id
      condition: req.body.condition,
      description: req.body.description,
      stock: req.body.stock,
      image: req.body.image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET PRODUCTS (CATEGORY + SELLER USERNAME POPULATION) */
router.get("/", getProductsByCategory);

/* DELETE PRODUCT */
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

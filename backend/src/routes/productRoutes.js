const express = require("express");
const router = express.Router();

// Import Multer
const upload = require('../config/multer'); // Multer middleware

// Import controller functions
const {
  addProduct,
  getProductsBySeller,
  deleteProduct,
  getProductsByCategory
} = require("../controllers/productController");

// ------------------ ROUTES ------------------

// Add product (with Multer image upload)
router.post("/add", upload.single("image"), addProduct);

// Get all products by seller
router.get("/seller/:sellerId", getProductsBySeller);

// Delete product
router.delete("/:id", deleteProduct);

// Get products by category (optional seller filter)
router.get("/category", getProductsByCategory);

module.exports = router;

const express = require("express");
const router = express.Router();

// Import Multer correctly
const upload = require('../config/multer'); // use the same name 'upload'

// Import controller functions
const {
  addProduct,
  getProductsBySeller,
  deleteProduct
} = require("../controllers/productController");

// Add product route with Multer
router.post("/add", upload.single("image"), addProduct);

// Get products by seller
router.get("/seller/:sellerId", getProductsBySeller);

// Delete product
router.delete("/:id", deleteProduct);

module.exports = router;

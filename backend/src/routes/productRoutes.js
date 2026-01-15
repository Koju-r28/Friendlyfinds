const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  addProduct,
  getProductsBySeller,
  getProductsByCategory,
  deleteProduct
} = require("../controllers/productController");

// ADD PRODUCT
router.post("/add", upload.single("image"), addProduct);

// GET COLLECTION PAGE PRODUCTS (MUST be ABOVE /seller)
router.get("/", getProductsByCategory);

// GET SELLER PRODUCTS
router.get("/seller/:sellerId", getProductsBySeller);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

module.exports = router;

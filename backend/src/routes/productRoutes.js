const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  addProduct,
  getProductsBySeller,
  getProductsByCategory,
  deleteProduct
} = require("../controllers/productController");

router.post("/add", upload.single("image"), addProduct);

router.get("/", getProductsByCategory);

router.get("/seller/:sellerId", getProductsBySeller);

router.delete("/:id", deleteProduct);

module.exports = router;

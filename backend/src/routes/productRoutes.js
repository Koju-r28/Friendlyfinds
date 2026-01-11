// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { 
  addProduct, 
  getProductsByStatus, 
  getProductsByCategory,
  approveProduct,
  rejectProduct,
  getProductsBySeller,
} = require('../controllers/productController');

// Add product with single image upload
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, condition, sellerId } = req.body;
    
    // Check if image was uploaded
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image is required' 
      });
    }

    const result = await addProduct(
      title,
      description,
      Number(price),
      category,
      condition,
      [imageUrl], // Pass as array
      sellerId
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Add product with multiple images (up to 5)
router.post('/add-multiple', upload.array('images', 5), async (req, res) => {
  try {
    const { title, description, price, category, condition, sellerId } = req.body;
    
    // Map all uploaded files to URLs
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    if (imageUrls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'At least one image is required' 
      });
    }

    const result = await addProduct(
      title,
      description,
      Number(price),
      category,
      condition,
      imageUrls,
      sellerId
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all pending products (for admin approval)
router.get('/pending', async (req, res) => {
  try {
    const result = await getProductsByStatus('pending');
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all approved products (for browsing)
router.get('/approved', async (req, res) => {
  try {
    const result = await getProductsByStatus('approved');
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await getProductsByCategory(category, 'approved');
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get products by seller
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const result = await getProductsBySeller(sellerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Admin: Approve product
router.patch('/approve/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await approveProduct(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Admin: Reject product
router.patch('/reject/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await rejectProduct(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
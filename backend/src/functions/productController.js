const Product = require('./productModel');

// Add a new product (when user wants to sell something)
const addProduct = async (title, description, price, category, condition, images, sellerId) => {
  try {
    const newProduct = new Product({
      title,
      description,
      price,
      category,
      condition,
      images,
      sellerId,
      status: 'pending'  // Starts as pending, needs admin approval
    });

    await newProduct.save();
    return { success: true, message: 'Product added, waiting for admin approval', product: newProduct };
  } catch (error) {
    return { success: false, message: 'Error adding product', error: error.message };
  }
};

// Get all products by status (approved products for browsing)
const getProductsByStatus = async (status) => {
  try {
    const products = await Product.find({ status }).populate('sellerId', 'email');
    return { success: true, products };
  } catch (error) {
    return { success: false, message: 'Error fetching products', error: error.message };
  }
};

// Get products by category (stationary or furniture)
const getProductsByCategory = async (category, status = 'approved') => {
  try {
    const products = await Product.find({ category, status }).populate('sellerId', 'email');
    return { success: true, products };
  } catch (error) {
    return { success: false, message: 'Error fetching products', error: error.message };
  }
};

// Admin approves product
const approveProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { status: 'approved' },
      { new: true }
    );
    
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    
    return { success: true, message: 'Product approved', product };
  } catch (error) {
    return { success: false, message: 'Error approving product', error: error.message };
  }
};

// Admin rejects product
const rejectProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { status: 'rejected' },
      { new: true }
    );
    
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    
    return { success: true, message: 'Product rejected', product };
  } catch (error) {
    return { success: false, message: 'Error rejecting product', error: error.message };
  }
};

// Get products by seller (for seller's history)
const getProductsBySeller = async (sellerId) => {
  try {
    const products = await Product.find({ sellerId });
    return { success: true, products };
  } catch (error) {
    return { success: false, message: 'Error fetching seller products', error: error.message };
  }
};

// Mark product as sold
const markProductAsSold = async (productId) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { status: 'sold' },
      { new: true }
    );
    
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    
    return { success: true, message: 'Product marked as sold', product };
  } catch (error) {
    return { success: false, message: 'Error updating product', error: error.message };
  }
};

module.exports = {
  addProduct,
  getProductsByStatus,
  getProductsByCategory,
  approveProduct,
  rejectProduct,
  getProductsBySeller,
  markProductAsSold
};  
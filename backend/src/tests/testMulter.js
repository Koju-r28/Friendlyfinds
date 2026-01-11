const express = require('express');
const path = require('path');
const connectDB = require('./src/config/db');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productRoutes);

connectDB();

const PORT = 5001; // Different port to not conflict

app.listen(PORT, () => {
  console.log(`🧪 Test server running on http://localhost:${PORT}`);
  console.log('\nTest product upload with:');
  console.log('POST http://localhost:5001/api/products/add');
  console.log('\nUse Postman/Thunder Client to test image upload');
  console.log('- Set method: POST');
  console.log('- Set body type: form-data');
  console.log('- Add fields: title, description, price, category, condition, sellerId');
  console.log('- Add file field: image (select an image file)');
});
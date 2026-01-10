// backend/src/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  sellerId: { type: String, required: true }, // associate with user
  condition: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  image: { type: String }, // store Base64 string for now
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

// backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {            // matches frontend
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {        // 🔴 ADD THIS
    type: String,        // store filename like "image-12345.png"
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

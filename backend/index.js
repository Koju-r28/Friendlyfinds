const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// CORS (allow frontend 5173)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json());

//  Connect DB
connectDB();

// Routes
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/auth', require('./src/routes/authRoutes')); // login/signup

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

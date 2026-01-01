const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

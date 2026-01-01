// db.js - Database connection file

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Connection URI from environment variable
const uri = process.env.MONGODB_URI;

// Create MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");
    
    // Select your database
    db = client.db('friendlyfinds_db');
    
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Get database instance
function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

// Close connection
async function closeDB() {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
}

module.exports = { connectDB, getDB, closeDB };

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');

const app = express();

// Enable CORS FIRST - before any routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Initialize database connection
connectDB();

// ==================== ITEM ROUTES ====================

// Create a new item
app.post('/api/items', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('items');
    
    const newItem = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      createdAt: new Date()
    };
    
    const result = await collection.insertOne(newItem);
    res.status(201).json({
      message: "Item created successfully",
      itemId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('items');
    
    const items = await collection.find({}).toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('items');
    const { ObjectId } = require('mongodb');
    
    const item = await collection.findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item
app.put('/api/items/:id', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('items');
    const { ObjectId } = require('mongodb');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('items');
    const { ObjectId } = require('mongodb');
    
    const result = await collection.deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CART ROUTES ====================

// Get user's cart
app.get('/api/cart/:userId', async (req, res) => {
  try {
    const db = getDB();
    const cart = db.collection('carts');
    
    const userCart = await cart.findOne({ userId: req.params.userId });
    
    if (!userCart) {
      return res.json({ userId: req.params.userId, items: [], total: 0 });
    }
    
    res.json(userCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
app.post('/api/cart/:userId/add', async (req, res) => {
  try {
    const db = getDB();
    const cart = db.collection('carts');
    const { itemId, name, price, quantity } = req.body;
    
    const result = await cart.updateOne(
      { userId: req.params.userId },
      {
        $push: {
          items: {
            itemId,
            name,
            price,
            quantity: quantity || 1,
            addedAt: new Date()
          }
        },
        $inc: { total: price * (quantity || 1) }
      },
      { upsert: true }
    );
    
    res.json({ message: "Item added to cart", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
app.delete('/api/cart/:userId/remove/:itemId', async (req, res) => {
  try {
    const db = getDB();
    const cart = db.collection('carts');
    
    const userCart = await cart.findOne({ userId: req.params.userId });
    
    if (!userCart || !userCart.items) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const item = userCart.items.find(i => i.itemId === req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    
    const result = await cart.updateOne(
      { userId: req.params.userId },
      {
        $pull: { items: { itemId: req.params.itemId } },
        $inc: { total: -(item.price * item.quantity) }
      }
    );
    
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item quantity in cart
app.put('/api/cart/:userId/update/:itemId', async (req, res) => {
  try {
    const db = getDB();
    const cart = db.collection('carts');
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }
    
    const userCart = await cart.findOne({ userId: req.params.userId });
    
    if (!userCart || !userCart.items) {
      return res.status(404).json({ message: "Cart not found" });
    }
    
    const item = userCart.items.find(i => i.itemId === req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    
    const priceDiff = (quantity - item.quantity) * item.price;
    
    const result = await cart.updateOne(
      { userId: req.params.userId, "items.itemId": req.params.itemId },
      {
        $set: { "items.$.quantity": quantity },
        $inc: { total: priceDiff }
      }
    );
    
    res.json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
app.delete('/api/cart/:userId/clear', async (req, res) => {
  try {
    const db = getDB();
    const cart = db.collection('carts');
    
    await cart.updateOne(
      { userId: req.params.userId },
      { $set: { items: [], total: 0 } }
    );
    
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== START SERVER (AT THE END!) ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
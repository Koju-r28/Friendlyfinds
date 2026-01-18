const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { signup, login, authMiddleware } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const result = await signup(email, password, username);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await login(email, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    const profileData = {
      name: user.username,
      username: user.username,
      email: user.email,
      location: user.location || 'Location not set',
      phone: user.phone || null,
      bio: user.bio || 'No bio added yet.',
      createdAt: user.createdAt,
      rating: user.averageRating || 0,
      soldCount: user.soldCount || 0,
      stats: {
        listings: user.listings?.length || 0,
        rating: user.averageRating || 0,
        sold: user.soldCount || 0
      },
      listings: user.listings || [],
      savedItems: user.savedItems || [],
      reviews: user.reviews || []
    };
    
    res.json(profileData);
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profileData = {
      name: user.username,
      username: user.username,
      email: user.email,
      location: user.location || 'Location not set',
      phone: user.phone || null,
      bio: user.bio || 'No bio added yet.',
      createdAt: user.createdAt,
      rating: user.averageRating || 0,
      soldCount: user.soldCount || 0,
      stats: {
        listings: user.listings?.length || 0,
        rating: user.averageRating || 0,
        sold: user.soldCount || 0
      },
      listings: user.listings || [],
      reviews: user.reviews || []
    };

    res.json(profileData);

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, email, phone, location, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        username, 
        email, 
        phone, 
        location, 
        bio 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        id: user._id
      }
    });

  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

router.delete('/saved/:itemId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    
    await User.findByIdAndUpdate(userId, {
      $pull: { savedItems: itemId }
    });
    
    res.json({ 
      success: true, 
      message: 'Item removed from saved' 
    });
    
  } catch (error) {
    console.error('Error removing saved item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
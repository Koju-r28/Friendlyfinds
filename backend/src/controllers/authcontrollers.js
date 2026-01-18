const User = require('../models/userModel');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(userId).select('-password'); 
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('GET PROFILE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const { name, email, phone, location } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, location },
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
      user: user
    });

  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
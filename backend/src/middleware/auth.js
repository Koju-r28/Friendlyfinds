const bcrypt = require('bcrypt');
const User = require('../models/user');

const signup = async (email, password, username) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username || email.split('@')[0],
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = `temp-jwt-token-${newUser._id}-${Date.now()}`;

    return { 
      success: true, 
      message: 'User created successfully', 
      user: { 
        id: newUser._id,
        username: newUser.username,
        email: newUser.email 
      },
      token: token
    };
  } catch (error) {
    return { success: false, message: 'Error creating user', error: error.message };
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid password' };
    }

    const token = `temp-jwt-token-${user._id}-${Date.now()}`;

    return { 
      success: true, 
      message: 'Login successful', 
      user: { 
        id: user._id,
        username: user.username,
        email: user.email 
      },
      token: token
    };
  } catch (error) {
    return { success: false, message: 'Error logging in', error: error.message };
  }
};

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided or invalid format' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token.startsWith('temp-jwt-token-')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format' 
      });
    }

    const tokenWithoutPrefix = token.replace('temp-jwt-token-', '');
    const userId = tokenWithoutPrefix.split('-')[0];
    
    if (!userId || userId.length !== 24) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid user ID in token' 
      });
    }
    
    req.user = { id: userId };
    next();
    
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token',
      error: error.message 
    });
  }
};

module.exports = { signup, login, authMiddleware };

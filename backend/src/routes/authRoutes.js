const express = require('express');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('Signup attempt:', { username, email });
    
    // Return success response
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully!',
      user: { 
        username, 
        email,
        id: Date.now().toString() // Temporary ID
      },
      token: 'temp-jwt-token-' + Date.now() // Temporary token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Signup failed',
      error: error.message 
    });
  }
});

// Register route (alias)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('Register attempt:', { username, email });
    
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully!',
      user: { 
        username, 
        email,
        id: Date.now().toString()
      },
      token: 'temp-jwt-token-' + Date.now()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    res.json({ 
      success: true,
      message: 'Login successful!',
      user: { 
        email,
        id: Date.now().toString()
      },
      token: 'temp-jwt-token-' + Date.now()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed',
      error: error.message 
    });
  }
});

module.exports = router;
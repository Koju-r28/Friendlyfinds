const Order = require('../models/orderModel');

const createOrder = async (req, res) => {
  try {
    const { name, email, location, message, productId } = req.body;

    if (!name || !email || !location || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    const order = new Order({
      name,
      email,
      location,
      message,
      productId: String(productId) //  force string
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });

  } catch (error) {
    console.error('ORDER ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createOrder };

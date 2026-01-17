const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');

// Get notifications for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    // Fetch notifications for this user
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    res.json(notifications); // returns an array directly
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

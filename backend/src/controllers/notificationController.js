const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.createNotification = async ({ userId, title, message, type }) => {
  try {
    if (!userId) return;
    await Notification.create({ userId, title, message, type });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};

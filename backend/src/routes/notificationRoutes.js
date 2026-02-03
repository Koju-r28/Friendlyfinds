const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getNotifications,
  markAsRead
} = require('../controllers/notificationController');

router.get('/', authMiddleware, getNotifications);
router.patch('/:id/read', authMiddleware, markAsRead);

module.exports = router;

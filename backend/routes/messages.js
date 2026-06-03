const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Message = require('../models/Message');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      filter = 'all', // all | read | unread
      sort = 'newest',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let queryObj = { deletedAt: null };

    if (filter === 'read') queryObj.isRead = true;
    if (filter === 'unread') queryObj.isRead = false;

    if (search) {
      queryObj.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const sortObj = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const [messages, total] = await Promise.all([
      Message.find(queryObj).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Message.countDocuments(queryObj),
    ]);

    const unreadCount = await Message.countDocuments({ isRead: false, deletedAt: null });

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Fetch messages error:', error);
    res.status(500).json({ success: false, message: 'Error fetching messages.' });
  }
});

//  Dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, unread, today, thisWeek] = await Promise.all([
      Message.countDocuments({ deletedAt: null }),
      Message.countDocuments({ isRead: false, deletedAt: null }),
      Message.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        deletedAt: null,
      }),
      Message.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        deletedAt: null,
      }),
    ]);

    res.json({ success: true, stats: { total, unread, today, thisWeek } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats.' });
  }
});

//  Get single message
router.get('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || message.deletedAt) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching message.' });
  }
});

//  Submit contact form (public)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, subject, message } = req.body;
      const newMessage = await Message.create({ name, email, subject, message });
      res.status(201).json({
        success: true,
        message: 'Message submitted successfully.',
        data: newMessage,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error submitting message.' });
    }
  }
);

//  Mark as read/unread
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const { isRead } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead, readAt: isRead ? new Date() : null },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating message.' });
  }
});

//  delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting message.' });
  }
});

//  delete (superadmin only)
router.delete('/:id/permanent', protect, authorize('superadmin'), async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message permanently deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting message.' });
  }
});

module.exports = router;

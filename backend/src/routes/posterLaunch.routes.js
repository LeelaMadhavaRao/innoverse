import express from 'express';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get poster launch configuration
router.get('/config', protect, (req, res) => {
  try {
    res.json({
      isActive: true,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maxSubmissions: 3
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update poster launch configuration (admin only)
router.put('/config', protect, isAdmin, (req, res) => {
  try {
    // TODO: Implement updating poster launch config
    res.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get poster launch events
router.get('/events', (req, res) => {
  try {
    res.json([
      {
        id: 1,
        title: 'Poster Submission Start',
        date: new Date(),
        description: 'Start submitting your posters'
      }
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Broadcast announcement (admin only)
router.post('/broadcast', protect, isAdmin, (req, res) => {
  try {
    // TODO: Implement broadcast functionality
    res.json({ message: 'Announcement broadcasted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

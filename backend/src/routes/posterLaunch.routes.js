import express from 'express';
import LaunchedPoster from '../models/launchedPoster.model.js';
import asyncHandler from 'express-async-handler';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all launched posters for public display (no auth required)
router.get('/public/launched', asyncHandler(async (req, res) => {
  try {
    const launchedPosters = await LaunchedPoster.find({ 
      status: 'active',
      isVisible: true 
    })
    .select('posterId title subtitle description imageUrl theme date organizer launchedAt analytics')
    .sort({ launchedAt: -1 });

    res.json({
      success: true,
      count: launchedPosters.length,
      data: launchedPosters
    });
  } catch (error) {
    console.error('Error fetching public launched posters:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching launched posters' 
    });
  }
}));

// Increment view count for a poster (no auth required)
router.put('/public/launched/:posterId/view', asyncHandler(async (req, res) => {
  try {
    const { posterId } = req.params;
    
    const poster = await LaunchedPoster.findOneAndUpdate(
      { posterId, status: 'active', isVisible: true },
      { $inc: { 'analytics.views': 1 } },
      { new: true }
    );

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: 'Poster not found'
      });
    }

    res.json({
      success: true,
      message: 'View counted',
      views: poster.analytics.views
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating view count' 
    });
  }
}));

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

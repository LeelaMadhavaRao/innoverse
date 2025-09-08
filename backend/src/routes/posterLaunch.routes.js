import express from 'express';
import { testPosterLaunch, getPublicLaunchedPosters, getPosterLaunchConfig, updatePosterLaunchConfig, getPosterLaunchEvents, launchNewPoster, resetPosterLaunch, broadcastAnnouncement } from '../controllers/posterLaunch.controller.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Test route to verify routes are working
router.get('/test', testPosterLaunch);

// Get all launched posters for public display (no auth required)
router.get('/public/launched', getPublicLaunchedPosters);

// Increment view count for a poster (no auth required) - simple inline handler
router.put('/public/launched/:posterId/view', (req, res) => {
  try {
    const { posterId } = req.params;
    console.log(`View count incremented for poster: ${posterId}`);

    res.json({
      success: true,
      message: 'View count updated',
      posterId: posterId,
      views: Math.floor(Math.random() * 100) + 1 // Random view count for demo
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating view count'
    });
  }
});

// Get poster launch configuration (requires auth)
router.get('/config', protect, getPosterLaunchConfig);

// Update poster launch configuration (admin only)
router.put('/config', protect, isAdmin, updatePosterLaunchConfig);

// Get poster launch events
router.get('/events', getPosterLaunchEvents);

// Launch a new poster (admin only)
router.post('/launch', protect, isAdmin, launchNewPoster);

// Reset poster launch (admin only)
router.post('/reset', protect, isAdmin, resetPosterLaunch);

// Broadcast announcement (admin only)
router.post('/broadcast', protect, isAdmin, broadcastAnnouncement);

export default router;

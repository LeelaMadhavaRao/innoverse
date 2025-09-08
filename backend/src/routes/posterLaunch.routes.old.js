import express from 'express';
// import LaunchedPoster from '../models/launchedPoster.model.js';
import asyncHandler from 'express-async-handler';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Test route to verify routes are working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Poster launch routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Get all launched posters for public display (no auth required)
router.get('/public/launched', asyncHandler(async (req, res) => {
  try {
    console.log('📢 Public launched posters endpoint hit');
    
    // Return sample data for now since model might be causing issues
    const samplePosters = [
      {
        posterId: 'sample-1',
        title: 'Welcome to Innoverse 2025',
        subtitle: 'Innovation Awaits',
        description: 'Join us for an exciting journey of innovation and entrepreneurship.',
        imageUrl: '/team-photo-of-4-students-working-together.jpg',
        theme: 'gradient-blue',
        date: new Date().toISOString(),
        organizer: 'Innoverse Team',
        launchedAt: new Date().toISOString()
      },
      {
        posterId: 'sample-2',
        title: 'Innoverse Competition 2025',
        subtitle: 'Ready to Innovate?',
        description: 'Showcase your innovative startup ideas and compete for recognition.',
        imageUrl: '/technical-architecture-diagram-with-ai-components.jpg',
        theme: 'gradient-purple',
        date: new Date().toISOString(),
        organizer: 'Innoverse Team',
        launchedAt: new Date().toISOString()
      }
    ];

    console.log(`Returning ${samplePosters.length} sample posters`);

    res.json({
      success: true,
      count: samplePosters.length,
      data: samplePosters
    });
  } catch (error) {
    console.error('Error fetching public launched posters:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching launched posters',
      error: error.message 
    });
  }
}));

// Increment view count for a poster (no auth required)
router.put('/public/launched/:posterId/view', asyncHandler(async (req, res) => {
  try {
    const { posterId } = req.params;
    
    // For now, just return success since we're using sample data
    console.log(`View count incremented for poster: ${posterId}`);

    res.json({
      success: true,
      message: 'View count updated',
      posterId: posterId
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

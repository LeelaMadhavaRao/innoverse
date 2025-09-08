import express from 'express';
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
router.get('/public/launched', (req, res) => {
  try {
    console.log('📢 Public launched posters endpoint hit');
    
    // Return sample data using the images mentioned
    const samplePosters = [
      {
        posterId: 'innoverse-main',
        title: 'Welcome to Innoverse 2025',
        subtitle: 'Innovation Awaits',
        description: 'Join us for an exciting journey of innovation and entrepreneurship. Present your innovative startup ideas and compete for certificates and recognition.',
        imageUrl: '/innoverse.jpg',
        theme: 'gradient-blue',
        date: new Date().toISOString(),
        organizer: 'Innoverse Team',
        launchedAt: new Date().toISOString(),
        analytics: {
          views: 0,
          interactions: 0
        }
      },
      {
        posterId: 'innoverse-potluck',
        title: 'Innoverse Networking Event',
        subtitle: 'Connect & Collaborate',
        description: 'Join our networking potluck event and connect with fellow innovators, mentors, and industry experts.',
        imageUrl: '/potluck.jpg',
        theme: 'gradient-purple',
        date: new Date().toISOString(),
        organizer: 'Innoverse Team',
        launchedAt: new Date().toISOString(),
        analytics: {
          views: 0,
          interactions: 0
        }
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
});

// Increment view count for a poster (no auth required)
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
router.get('/config', protect, (req, res) => {
  try {
    const config = {
      isLaunchEnabled: true,
      maxPosters: 10,
      currentCount: 2,
      lastUpdated: new Date().toISOString()
    };
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update poster launch configuration (admin only)
router.put('/config', protect, isAdmin, (req, res) => {
  try {
    res.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get poster launch events
router.get('/events', (req, res) => {
  try {
    const events = [
      {
        id: 1,
        title: 'Poster Submission Start',
        date: new Date().toISOString(),
        description: 'Start submitting your posters'
      },
      {
        id: 2,
        title: 'Registration Open',
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        description: 'Team registration is now open'
      },
      {
        id: 3,
        title: 'Competition Day',
        date: new Date(Date.now() + 7 * 86400000).toISOString(), // Next week
        description: 'Present your innovative ideas'
      }
    ];
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Launch a new poster (admin only)
router.post('/launch', protect, isAdmin, (req, res) => {
  try {
    const { title, subtitle, description, imageUrl, theme } = req.body;
    
    const newPoster = {
      posterId: `poster-${Date.now()}`,
      title,
      subtitle,
      description,
      imageUrl,
      theme,
      date: new Date().toISOString(),
      organizer: req.user.name || 'Admin',
      launchedAt: new Date().toISOString(),
      status: 'active',
      isVisible: true,
      analytics: {
        views: 0,
        interactions: 0
      }
    };

    res.status(201).json({
      success: true,
      message: 'Poster launched successfully',
      data: newPoster
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while launching poster' 
    });
  }
});

// Reset poster launch (admin only)
router.post('/reset', protect, isAdmin, (req, res) => {
  try {
    res.json({ 
      success: true,
      message: 'Poster launch reset successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Broadcast announcement (admin only)
router.post('/broadcast', protect, isAdmin, (req, res) => {
  try {
    res.json({ message: 'Announcement broadcasted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

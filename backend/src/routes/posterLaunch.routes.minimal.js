import express from 'express';

const router = express.Router();

// Test route to verify basic route functionality
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Minimal poster launch routes working!',
    timestamp: new Date().toISOString()
  });
});

// Get all launched posters for public display (no auth required)
router.get('/public/launched', (req, res) => {
  console.log('📢 Public launched posters endpoint hit');
  
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

  res.json({
    success: true,
    count: samplePosters.length,
    data: samplePosters
  });
});

// Get poster launch events
router.get('/events', (req, res) => {
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
      date: new Date(Date.now() + 86400000).toISOString(),
      description: 'Team registration is now open'
    }
  ];
  res.json(events);
});

export default router;

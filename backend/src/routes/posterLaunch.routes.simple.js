import express from 'express';

const router = express.Router();

// Test route
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
    
    // Return sample data
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
      }
    ];
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

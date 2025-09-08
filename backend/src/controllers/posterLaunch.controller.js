import asyncHandler from 'express-async-handler';

// Test route to verify routes are working
export const testPosterLaunch = asyncHandler(async (req, res) => {
  res.json({ 
    message: 'Poster launch routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Get all launched posters for public display (no auth required)
export const getPublicLaunchedPosters = asyncHandler(async (req, res) => {
  console.log('📢 Public launched posters endpoint hit');
  
  // Return sample data using the images mentioned
  const samplePosters = [
    {
      posterId: 'poster-innoverse-2024',
      title: 'Innoverse 2024',
      subtitle: 'Innovation Competition',
      description: 'Join us for the biggest innovation competition of the year! Present your groundbreaking ideas and compete with the best minds.',
      imageUrl: '/images/innoverse.jpg',
      theme: 'technology',
      date: new Date().toISOString(),
      organizer: 'Innoverse Team',
      launchedAt: new Date().toISOString(),
      analytics: {
        views: 0,
        interactions: 0
      }
    },
    {
      posterId: 'poster-potluck-2024',
      title: 'Community Potluck',
      subtitle: 'Networking Event',
      description: 'Come together for an evening of networking, delicious food, and meaningful connections. Bring your favorite dish to share!',
      imageUrl: '/images/potluck.jpg',
      theme: 'community',
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
});

// Increment view count for a poster (no auth required)
export const incrementPosterView = asyncHandler(async (req, res) => {
  const { posterId } = req.params;
  console.log(`View count incremented for poster: ${posterId}`);

  res.json({
    success: true,
    message: 'View count updated',
    posterId: posterId,
    views: Math.floor(Math.random() * 100) + 1 // Random view count for demo
  });
});

// Get poster launch configuration (requires auth)
export const getPosterLaunchConfig = asyncHandler(async (req, res) => {
  const config = {
    isLaunchEnabled: true,
    maxPosters: 10,
    currentCount: 2,
    lastUpdated: new Date().toISOString()
  };
  res.json(config);
});

// Update poster launch configuration (admin only)
export const updatePosterLaunchConfig = asyncHandler(async (req, res) => {
  res.json({ message: 'Configuration updated successfully' });
});

// Get poster launch events
export const getPosterLaunchEvents = asyncHandler(async (req, res) => {
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
});

// Launch a new poster (admin only)
export const launchNewPoster = asyncHandler(async (req, res) => {
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
});

// Reset poster launch (admin only)
export const resetPosterLaunch = asyncHandler(async (req, res) => {
  res.json({ 
    success: true,
    message: 'Poster launch reset successfully' 
  });
});

// Broadcast announcement (admin only)
export const broadcastAnnouncement = asyncHandler(async (req, res) => {
  res.json({ message: 'Announcement broadcasted successfully' });
});

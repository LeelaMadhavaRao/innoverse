import { LaunchedPoster } from '../models/index.js';

// Test endpoint
export const testPosterLaunch = (req, res) => {
  res.json({ 
    message: 'Poster launch routes are working!',
    timestamp: new Date().toISOString()
  });
};

// Get public launched posters
export const getPublicLaunchedPosters = async (req, res) => {
  try {
    const posters = await LaunchedPoster.find({ 
      status: 'active',
      isVisible: true 
    })
    .populate('launchedBy', 'name email')
    .sort({ launchedAt: -1 });

    // Increment view count for each poster
    await LaunchedPoster.updateMany(
      { _id: { $in: posters.map(p => p._id) } },
      { $inc: { 'analytics.views': 1 } }
    );

    res.json({
      success: true,
      count: posters.length,
      data: posters
    });
  } catch (error) {
    console.error('Error fetching public launched posters:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching launched posters',
      error: error.message 
    });
  }
};

// Get poster launch config
export const getPosterLaunchConfig = async (req, res) => {
  try {
    const totalPosters = await LaunchedPoster.countDocuments();
    const activePosters = await LaunchedPoster.countDocuments({ status: 'active' });
    
    const config = {
      isLaunchEnabled: true,
      maxPosters: 10,
      currentCount: totalPosters,
      activeCount: activePosters,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(config);
  } catch (error) {
    console.error('Get poster config error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update poster launch config
export const updatePosterLaunchConfig = async (req, res) => {
  try {
    const { isLaunchEnabled, maxPosters } = req.body;
    
    // In a real app, you'd store this config in database
    const config = {
      isLaunchEnabled: isLaunchEnabled !== undefined ? isLaunchEnabled : true,
      maxPosters: maxPosters || 10,
      lastUpdated: new Date().toISOString(),
      updatedBy: req.user._id
    };
    
    res.json(config);
  } catch (error) {
    console.error('Update poster config error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get poster launch events
export const getPosterLaunchEvents = (req, res) => {
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
        date: new Date(Date.now() + 86400000).toISOString(),
        description: 'Team registration is now open'
      },
      {
        id: 3,
        title: 'Competition Day',
        date: new Date(Date.now() + 7 * 86400000).toISOString(),
        description: 'Present your innovative ideas'
      }
    ];
    res.json(events);
  } catch (error) {
    console.error('Get poster events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Broadcast message
export const broadcastMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    // In a real app, you'd implement SSE or WebSocket here
    console.log('Broadcasting message:', message);
    
    res.json({ 
      success: true,
      message: 'Message broadcasted successfully',
      broadcastedMessage: message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Broadcast message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Launch poster
export const launchPoster = async (req, res) => {
  try {
    const posterData = req.body;
    
    const poster = await LaunchedPoster.create({
      ...posterData,
      launchedBy: req.user._id,
      status: 'active',
      isVisible: true,
      launchedAt: new Date()
    });

    const populatedPoster = await LaunchedPoster.findById(poster._id)
      .populate('launchedBy', 'name email');

    res.status(201).json({
      success: true,
      data: populatedPoster
    });
  } catch (error) {
    console.error('Launch poster error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Stop poster
export const stopPoster = async (req, res) => {
  try {
    const { id } = req.params;
    
    const poster = await LaunchedPoster.findByIdAndUpdate(
      id,
      { 
        status: 'inactive',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!poster) {
      return res.status(404).json({ message: 'Poster not found' });
    }

    res.json({
      success: true,
      message: 'Poster stopped successfully',
      data: poster
    });
  } catch (error) {
    console.error('Stop poster error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

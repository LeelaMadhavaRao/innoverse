import Team from '../models/Team.js';
import Gallery from '../models/Gallery.js';
import Evaluation from '../models/Evaluation.js';
import User from '../models/User.js';

// Helper function to find user's team
const findUserTeam = async (user, excludePassword = true) => {
  const query = {
    $or: [
      { 'teamLeader.email': user.email },
      { 'teamMembers': { $elemMatch: { email: user.email } } },
      { 'credentials.username': user.email },
      { 'credentials.username': user.username }
    ]
  };

  if (excludePassword) {
    return await Team.findOne(query).select('-credentials.password');
  }
  return await Team.findOne(query);
};

// Get team profile
export const getTeamProfile = async (req, res) => {
  try {
    const user = req.user;
    
    // Find team using helper function
    const team = await findUserTeam(user);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get team statistics
    const galleryCount = await Gallery.countDocuments({ 
      uploadedBy: user._id,
      status: { $in: ['pending', 'approved'] }
    });
    
    const evaluationCount = await Evaluation.countDocuments({ teamId: team._id });
    
    // Calculate evaluation scores
    const evaluations = await Evaluation.find({ teamId: team._id });
    let averageScore = 0;
    let totalScore = 0;
    
    if (evaluations.length > 0) {
      totalScore = evaluations.reduce((acc, evaluation) => acc + (evaluation.totalScore || 0), 0);
      averageScore = totalScore / evaluations.length;
    }

    // Prepare team profile response with stats
    const teamProfile = {
      ...team.toObject(),
      stats: {
        galleryItems: galleryCount,
        evaluations: evaluationCount,
        projectsSubmitted: team.status === 'submitted' ? 1 : 0,
        evaluationsCompleted: evaluationCount,
        status: team.status,
        memberCount: (team.teamMembers?.length || 0) + 1, // +1 for leader
        totalScore: Math.round(totalScore),
        averageScore: Math.round(averageScore),
        currentRank: '--',
        ranksDisclosed: false
      },
      // Ensure proper structure for frontend
      teamName: team.teamName,
      teamLeader: team.teamLeader,
      teamMembers: team.teamMembers || [],
      projectDetails: team.projectDetails || { description: '', techStack: [] },
      status: team.status,
      evaluationStatus: team.evaluationStatus || 'not_started',
      createdAt: team.createdAt,
      updatedAt: team.updatedAt
    };

    res.json(teamProfile);
  } catch (error) {
    console.error('Get team profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update team profile
export const updateTeamProfile = async (req, res) => {
  try {
    const user = req.user;
    const updateData = req.body;
    
    // Find team using helper function
    const team = await findUserTeam(user, false);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Store original values for change tracking
    const originalTeamName = team.teamName;
    const originalTeamLeader = { ...team.teamLeader };
    let teamLeaderChanged = false;

    // Handle different update scenarios
    if (updateData.problemStatement !== undefined) {
      // Update problem statement in projectDetails
      if (!team.projectDetails) {
        team.projectDetails = {};
      }
      team.projectDetails.description = updateData.problemStatement;
    }

    if (updateData.teamName && updateData.teamName !== team.teamName) {
      team.teamName = updateData.teamName;
    }

    if (updateData.teamLeader) {
      // Check if team leader is being changed
      if (typeof updateData.teamLeader === 'string') {
        // Handle case where teamLeader is just a name string
        team.teamLeader.name = updateData.teamLeader;
      } else if (updateData.teamLeader.email && updateData.teamLeader.email !== team.teamLeader.email) {
        // Team leader email is changing
        teamLeaderChanged = true;
        team.teamLeader = { ...team.teamLeader, ...updateData.teamLeader };
        team.credentials.username = updateData.teamLeader.email;
      } else {
        // Update other team leader details
        team.teamLeader = { ...team.teamLeader, ...updateData.teamLeader };
      }
    }

    if (updateData.teamMembers) {
      team.teamMembers = updateData.teamMembers;
    }

    // Update other fields
    if (updateData.projectDetails) {
      team.projectDetails = { ...team.projectDetails, ...updateData.projectDetails };
    }

    // Set updated timestamp
    team.updatedAt = new Date();
    
    // Save the updated team
    await team.save();
    
    // Return updated team without sensitive data
    const updatedTeam = await Team.findById(team._id).select('-credentials.password');

    // Prepare response with change information
    const response = {
      success: true,
      data: {
        team: updatedTeam,
        changes: {
          teamNameChanged: updateData.teamName && updateData.teamName !== originalTeamName,
          teamLeaderChanged,
          membersUpdated: updateData.teamMembers ? team.teamMembers.length : 0
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Update team profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get team gallery
export const getTeamGallery = async (req, res) => {
  try {
    const user = req.user;
    
    // Get team's own uploaded items
    const myPhotos = await Gallery.find({ uploadedBy: user._id })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    // Get all approved public photos (excluding own photos to avoid duplicates)
    const publicPhotos = await Gallery.find({ 
      status: 'approved',
      uploadedBy: { $ne: user._id }
    })
      .populate('uploadedBy', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    // Format the data to match frontend expectations
    const galleryItems = [
      ...(myPhotos || []).map(photo => ({
        id: photo._id,
        title: photo.title,
        description: photo.description,
        images: [photo.imageUrl || photo.url],
        category: photo.category,
        status: photo.status,
        views: photo.views || 0,
        likes: photo.likes || 0,
        uploadDate: photo.createdAt,
        isOwn: true,
        uploadedBy: user.name || user.email || 'Unknown',
        approvedBy: photo.approvedBy?.name
      })),
      ...(publicPhotos || []).map(photo => ({
        id: photo._id,
        title: photo.title,
        description: photo.description,
        images: [photo.imageUrl || photo.url],
        category: photo.category,
        status: photo.status,
        views: photo.views || 0,
        likes: photo.likes || 0,
        uploadDate: photo.createdAt,
        isOwn: false,
        uploadedBy: photo.uploadedBy?.name || 'Unknown',
        approvedBy: photo.approvedBy?.name
      }))
    ];

    res.json({
      success: true,
      data: {
        items: galleryItems,
        myPhotos: (myPhotos || []).length,
        publicPhotos: (publicPhotos || []).length,
        totalCount: galleryItems.length
      }
    });
  } catch (error) {
    console.error('Get team gallery error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get team results
export const getTeamResults = async (req, res) => {
  try {
    const user = req.user;
    
    // Find team using helper function
    const team = await findUserTeam(user);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get evaluations for this team
    const evaluations = await Evaluation.find({ teamId: team._id })
      .populate('evaluatorId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate average scores
    let averageScores = {};
    let totalScore = 0;
    
    if (evaluations.length > 0) {
      const scoreKeys = ['innovation', 'technical', 'presentation', 'feasibility', 'impact'];
      scoreKeys.forEach(key => {
        const sum = evaluations.reduce((acc, evaluation) => acc + (evaluation.scores?.[key] || 0), 0);
        averageScores[key] = sum / evaluations.length;
      });
      
      totalScore = evaluations.reduce((acc, evaluation) => acc + (evaluation.totalScore || 0), 0) / evaluations.length;
    }

    // Format results for frontend expectations
    const formattedResults = (evaluations || []).map(evaluation => ({
      id: evaluation._id,
      evaluationTitle: 'Project Evaluation',
      score: evaluation.totalScore || 0,
      maxScore: 100,
      feedback: evaluation.feedback || evaluation.comments || '',
      evaluatedAt: evaluation.evaluatedAt || evaluation.createdAt,
      evaluatorName: evaluation.evaluatorId?.name || 'Anonymous',
      category: 'General',
      criteria: [
        { name: 'Innovation', score: evaluation.scores?.innovation || 0, maxScore: 10 },
        { name: 'Technical Implementation', score: evaluation.scores?.technical || 0, maxScore: 10 },
        { name: 'Presentation', score: evaluation.scores?.presentation || 0, maxScore: 10 },
        { name: 'Feasibility', score: evaluation.scores?.feasibility || 0, maxScore: 10 },
        { name: 'Impact', score: evaluation.scores?.impact || 0, maxScore: 10 }
      ]
    }));

    res.json({
      success: true,
      data: formattedResults,
      team: {
        teamName: team.teamName,
        status: team.status,
        evaluationStatus: team.evaluationStatus
      },
      averageScores,
      totalScore: Math.round(totalScore || 0),
      evaluationCount: (evaluations || []).length
    });
  } catch (error) {
    console.error('Get team results error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

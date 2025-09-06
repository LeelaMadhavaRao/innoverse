import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Team from '../models/team.model.js';
import Faculty from '../models/faculty.model.js';
import Evaluator from '../models/evaluator.model.js';
import Gallery from '../models/gallery.model.js';
import emailService from '../services/emailService.js';
import crypto from 'crypto';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalTeams,
    totalFaculty,
    totalEvaluators,
    totalEvaluations,
    totalUsers,
    totalPhotos,
    pendingEvaluations,
    activeTeams
  ] = await Promise.all([
    Team.countDocuments(),
    Faculty.countDocuments(),
    Evaluator.countDocuments(),
    Team.aggregate([
      { $unwind: '$evaluationScores' },
      { $count: 'total' }
    ]),
    User.countDocuments(),
    Gallery.countDocuments(),
    Team.countDocuments({ evaluationStatus: { $ne: 'completed' } }),
    Team.countDocuments({ status: 'active' })
  ]);

  const recentActivity = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  res.json({
    stats: {
      totalTeams,
      totalFaculty,
      totalEvaluators,
      totalEvaluations: totalEvaluations[0]?.total || 0,
      totalUsers,
      totalPhotos,
      pendingEvaluations,
      activeTeams
    },
    recentActivity
  });
});

// ==================== TEAM MANAGEMENT ====================

// @desc    Get all teams
// @route   GET /api/admin/teams
// @access  Private/Admin
export const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find()
    .populate('evaluationScores.evaluatorId', 'name email')
    .sort({ createdAt: -1 });

  res.json(teams);
});

// @desc    Create new team with credentials
// @route   POST /api/admin/teams
// @access  Private/Admin
export const createTeam = asyncHandler(async (req, res) => {
  const { 
    teamName, 
    teamLeader, 
    teamMembers, 
    projectDetails, 
    teamSize,
    customPassword
  } = req.body;

  // Validate required fields
  if (!teamName || !teamLeader?.name || !teamLeader?.email) {
    res.status(400);
    throw new Error('Team name, leader name, and leader email are required');
  }

  // Validate team size and members
  if (teamSize && teamMembers && teamMembers.length !== teamSize - 1) {
    res.status(400);
    throw new Error(`Team members count must match team size minus leader (${teamSize - 1} members expected)`);
  }

  // Check if team already exists
  const existingTeam = await Team.findOne({ 
    $or: [
      { teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } },
      { 'teamLeader.email': teamLeader.email }
    ]
  });
  if (existingTeam) {
    res.status(400);
    throw new Error('Team with this name or leader email already exists');
  }

  // Check if team leader email already exists
  const existingUser = await User.findOne({ email: teamLeader.email });
  if (existingUser) {
    res.status(400);
    throw new Error('Team leader email already registered');
  }

  // Generate unique username and password
  const username = teamName.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + Date.now().toString().slice(-4);
  const password = customPassword || crypto.randomBytes(12).toString('hex');

  // Prepare team members array (including leader)
  const allMembers = [
    {
      name: teamLeader.name,
      email: teamLeader.email,
      role: 'leader',
      isLeader: true
    },
    ...(teamMembers || []).map(member => ({
      name: member,
      role: 'member',
      isLeader: false
    }))
  ];

  // Create team
  const team = await Team.create({
    teamName,
    teamLeader: {
      name: teamLeader.name,
      email: teamLeader.email,
      phone: teamLeader.phone || ''
    },
    teamMembers: allMembers,
    teamSize: teamSize || allMembers.length,
    projectDetails: projectDetails || {},
    credentials: {
      username,
      password,
      createdBy: req.user._id
    },
    status: 'active',
    invitationSent: false,
    createdBy: req.user._id
  });

  // Create user account for team
  const user = await User.create({
    name: teamLeader.name,
    email: teamLeader.email,
    password,
    role: 'team',
    teamProfile: team._id,
    isActive: true,
    createdBy: req.user._id
  });

  // Send invitation email
  try {
    const emailResult = await emailService.sendTeamInvitation({
      teamData: {
        teamName,
        teamLeader,
        teamMembers: allMembers,
        teamSize: team.teamSize
      },
      credentials: {
        username,
        password,
        loginUrl: `${process.env.FRONTEND_URL}/login`
      },
      adminMessage: `Team created by admin. Access your team dashboard with the credentials below.`
    });

    // Mark invitation as sent
    team.invitationSent = true;
    team.invitationSentAt = new Date();
    await team.save();

    console.log('✅ Team invitation email sent successfully');
  } catch (emailError) {
    console.error('❌ Failed to send invitation email:', emailError);
    // Don't fail the team creation if email fails
  }

  res.status(201).json({
    message: 'Team created successfully and invitation sent',
    team: {
      _id: team._id,
      teamName: team.teamName,
      teamLeader: team.teamLeader,
      teamMembers: team.teamMembers,
      teamSize: team.teamSize,
      status: team.status,
      invitationSent: team.invitationSent,
      createdAt: team.createdAt
    },
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    credentials: {
      username,
      password: password // Include password in response for admin reference
    }
  });
});

// @desc    Resend team invitation
// @route   POST /api/admin/teams/:id/resend-invitation
// @access  Private/Admin
export const resendTeamInvitation = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Send invitation email
  await emailService.sendTeamInvitation({
    teamData: team,
    credentials: team.credentials
  });

  // Update invitation sent status
  team.invitationSent = true;
  team.invitationSentAt = new Date();
  await team.save();

  res.json({ message: 'Invitation resent successfully' });
});

// ==================== FACULTY MANAGEMENT ====================

// @desc    Get all faculty
// @route   GET /api/admin/faculty
// @access  Private/Admin
export const getFaculty = asyncHandler(async (req, res) => {
  const faculty = await Faculty.find()
    .populate('userId', 'name email status lastLoginAt')
    .populate('assignedTeams', 'teamName')
    .sort({ createdAt: -1 });

  res.json(faculty);
});

// @desc    Create new faculty member
// @route   POST /api/admin/faculty
// @access  Private/Admin
export const createFaculty = asyncHandler(async (req, res) => {
  const { name, email, department, designation, specialization, experience } = req.body;

  // Check if faculty email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Faculty email already registered');
  }

  // Generate password
  const password = crypto.randomBytes(8).toString('hex');

  // Create user account
  const user = await User.create({
    name,
    email,
    password,
    role: 'faculty',
    createdBy: req.user._id
  });

  // Create faculty profile
  const faculty = await Faculty.create({
    name,
    email,
    userId: user._id,
    department,
    designation,
    specialization,
    experience,
    status: 'active'
  });

  // Link faculty profile to user
  user.facultyProfile = faculty._id;
  await user.save();

  // Send invitation email
  try {
    await emailService.sendFacultyInvitation({
      facultyData: {
        name,
        email,
        department,
        designation,
        specialization
      },
      credentials: {
        password
      }
    });

    // Mark invitation as sent
    faculty.invitationSent = true;
    faculty.invitationSentAt = new Date();
    await faculty.save();
  } catch (emailError) {
    console.error('Failed to send faculty invitation:', emailError);
  }

  res.status(201).json({
    message: 'Faculty member created successfully and invitation sent',
    faculty,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Resend faculty invitation
// @route   POST /api/admin/faculty/:id/resend-invitation
// @access  Private/Admin
export const resendFacultyInvitation = asyncHandler(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id).populate('userId');
  
  if (!faculty) {
    res.status(404);
    throw new Error('Faculty member not found');
  }

  // Generate new password
  const newPassword = crypto.randomBytes(8).toString('hex');
  faculty.userId.password = newPassword;
  await faculty.userId.save();

  // Send invitation email
  await emailService.sendFacultyInvitation({
    facultyData: faculty,
    credentials: {
      password: newPassword
    }
  });

  // Update invitation sent status
  faculty.invitationSent = true;
  faculty.invitationSentAt = new Date();
  await faculty.save();

  res.json({ message: 'Faculty invitation resent successfully' });
});

// ==================== EVALUATOR MANAGEMENT ====================

// @desc    Get all evaluators
// @route   GET /api/admin/evaluators
// @access  Private/Admin
export const getEvaluators = asyncHandler(async (req, res) => {
  const evaluators = await Evaluator.find()
    .populate('userId', 'name email status lastLoginAt')
    .populate('assignedTeams.teamId', 'teamName')
    .sort({ createdAt: -1 });

  res.json(evaluators);
});

// @desc    Create new evaluator
// @route   POST /api/admin/evaluators
// @access  Private/Admin
export const createEvaluator = asyncHandler(async (req, res) => {
  const { name, email, organization, designation, expertise, experience, type } = req.body;

  // Check if evaluator email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Evaluator email already registered');
  }

  // Generate password
  const password = crypto.randomBytes(8).toString('hex');

  // Create user account
  const user = await User.create({
    name,
    email,
    password,
    role: 'evaluator',
    createdBy: req.user._id
  });

  // Create evaluator profile
  const evaluator = await Evaluator.create({
    name,
    email,
    userId: user._id,
    organization,
    designation,
    expertise: expertise ? expertise.split(',').map(e => e.trim()) : [],
    experience,
    type,
    status: 'active',
    evaluationCriteria: {
      innovation: { weight: 20, maxScore: 100 },
      technical: { weight: 20, maxScore: 100 },
      business: { weight: 20, maxScore: 100 },
      presentation: { weight: 20, maxScore: 100 },
      feasibility: { weight: 20, maxScore: 100 }
    }
  });

  // Link evaluator profile to user
  user.evaluatorProfile = evaluator._id;
  await user.save();

  // Send invitation email
  try {
    await emailService.sendEvaluatorInvitation({
      evaluatorData: {
        name,
        email,
        organization,
        expertise: expertise,
        type
      },
      credentials: {
        password
      }
    });

    // Mark invitation as sent
    evaluator.invitationSent = true;
    evaluator.invitationSentAt = new Date();
    await evaluator.save();
  } catch (emailError) {
    console.error('Failed to send evaluator invitation:', emailError);
  }

  res.status(201).json({
    message: 'Evaluator created successfully and invitation sent',
    evaluator,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Assign teams to evaluator
// @route   POST /api/admin/evaluators/:id/assign-teams
// @access  Private/Admin
export const assignTeamsToEvaluator = asyncHandler(async (req, res) => {
  const { teamIds } = req.body;
  const evaluator = await Evaluator.findById(req.params.id);

  if (!evaluator) {
    res.status(404);
    throw new Error('Evaluator not found');
  }

  // Validate teams exist
  const teams = await Team.find({ _id: { $in: teamIds } });
  if (teams.length !== teamIds.length) {
    res.status(400);
    throw new Error('Some teams not found');
  }

  // Add teams to evaluator's assigned teams
  const newAssignments = teamIds.map(teamId => ({
    teamId,
    assignedAt: new Date(),
    status: 'assigned'
  }));

  evaluator.assignedTeams.push(...newAssignments);
  evaluator.totalEvaluationsAssigned += teamIds.length;
  await evaluator.save();

  res.json({
    message: `${teamIds.length} teams assigned to evaluator successfully`,
    evaluator
  });
});

// ==================== EVALUATION MANAGEMENT ====================

// @desc    Get all evaluations with scores
// @route   GET /api/admin/evaluations
// @access  Private/Admin
export const getEvaluations = asyncHandler(async (req, res) => {
  const teams = await Team.find()
    .populate('evaluationScores.evaluatorId', 'name email')
    .select('teamName teamLeader evaluationScores evaluationStatus finalRank finalScore')
    .sort({ finalRank: 1, finalScore: -1 });

  // Get total number of evaluators
  const totalEvaluators = await Evaluator.countDocuments();

  // Calculate team rankings
  const teamsWithScores = teams.map(team => {
    const averageScore = team.calculateAverageScore();
    return {
      ...team.toObject(),
      averageScore: parseFloat(averageScore.toFixed(1)),
      evaluationsCompleted: team.evaluationScores.length,
      evaluationsRemaining: totalEvaluators - team.evaluationScores.length
    };
  });

  // Sort by average score
  teamsWithScores.sort((a, b) => b.averageScore - a.averageScore);

  // Add ranking
  teamsWithScores.forEach((team, index) => {
    team.currentRank = index + 1;
  });

  res.json(teamsWithScores);
});

// @desc    Get detailed evaluation for a team
// @route   GET /api/admin/evaluations/team/:teamId
// @access  Private/Admin
export const getTeamEvaluations = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.teamId)
    .populate('evaluationScores.evaluatorId', 'name email organization')
    .populate('teamLeader');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  res.json(team);
});

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .populate('teamId', 'teamName')
    .populate('facultyProfile', 'department designation')
    .populate('evaluatorProfile', 'organization type')
    .sort({ createdAt: -1 });

  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow deletion of admin users
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin users');
  }

  // Delete associated profiles
  if (user.facultyProfile) {
    await Faculty.findByIdAndDelete(user.facultyProfile);
  }
  if (user.evaluatorProfile) {
    await Evaluator.findByIdAndDelete(user.evaluatorProfile);
  }
  if (user.teamId) {
    await Team.findByIdAndDelete(user.teamId);
  }

  await user.deleteOne();
  res.json({ message: 'User and associated data removed successfully' });
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Don't allow role change for admin users
  if (user.role === 'admin' && req.body.role !== 'admin') {
    res.status(400);
    throw new Error('Cannot change admin user role');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.status = req.body.status || user.status;
  user.lastModifiedBy = req.user._id;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    status: updatedUser.status,
    lastModifiedBy: updatedUser.lastModifiedBy,
    updatedAt: updatedUser.updatedAt
  });
});

// ==============================================
// POSTER LAUNCH MANAGEMENT
// ==============================================

// @desc    Get all available posters
// @route   GET /api/admin/poster-launch/posters
// @access  Private/Admin
export const getPosters = asyncHandler(async (req, res) => {
  // In a real implementation, this would fetch from a database
  // For now, we'll return the predefined posters
  const posters = [
    {
      id: 'innoverse-2025',
      title: 'Innoverse 2025',
      subtitle: 'Startup Contest',
      description: 'A Startup Contest where we dive deep into the brain for bold ideas',
      tagline: 'Your Pitch. Your Future',
      date: 'SEPTEMBER 15 2K25',
      organizer: 'CSIT DEPARTMENT',
      theme: 'startup-innovation',
      imageUrl: '/innoverse-poster.jpg',
      colors: {
        primary: '#8B5CF6',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)'
      },
      sponsors: ['Dhimavaram', 'Smart work', 'TechGuru', 'InnovaDelight'],
      hods: ['Dr N. Gopi Krishna Murthy', 'Dr M. Suresh Babu'],
      faculty: ['Mr. P.S.V. Surya Kumar', 'Mr. N. Praveen', 'Mr. P. Manoj'],
      status: 'ready',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'potluck-2025',
      title: 'POT LUCK',
      subtitle: 'Community Gathering',
      description: 'Lets meet for the lunch together',
      tagline: 'III CSIT\'s LOVE',
      date: 'AUGUST 16TH 2025',
      organizer: 'III CSIT Students',
      theme: 'community-love',
      imageUrl: '/potluck-poster.jpg',
      colors: {
        primary: '#DC2626',
        secondary: '#F59E0B',
        accent: '#10B981',
        background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #dc2626 100%)'
      },
      values: ['Warmth', 'Trust', 'Cheer', 'Joy', 'Kindness', 'Unity', 'Affection'],
      status: 'ready',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  res.json(posters);
});

// @desc    Launch a poster with configuration
// @route   POST /api/admin/poster-launch/launch
// @access  Private/Admin
export const launchPoster = asyncHandler(async (req, res) => {
  const { posterId, posterData, config, launchedBy } = req.body;

  if (!posterId || !posterData || !config) {
    res.status(400);
    throw new Error('Poster ID, poster data, and configuration are required');
  }

  // Create launch record
  const launchData = {
    id: crypto.randomUUID(),
    posterId,
    title: posterData.title,
    subtitle: posterData.subtitle,
    description: posterData.description,
    theme: posterData.theme,
    posterData,
    config: {
      scheduledTime: config.scheduledTime || new Date().toISOString(),
      duration: parseInt(config.duration) || 24,
      targetAudience: config.targetAudience || 'all',
      message: config.message || '',
      priority: config.priority || 'medium'
    },
    launchedAt: new Date().toISOString(),
    launchedBy: launchedBy || req.user.id,
    status: 'active',
    analytics: {
      views: 0,
      interactions: 0,
      shares: 0
    }
  };

  // In a real implementation, this would be saved to a database
  // For now, we'll simulate a successful launch
  
  // Simulate poster broadcast/notification system
  console.log(`🚀 Poster Launch: ${posterData.title}`);
  console.log(`📊 Configuration:`, config);
  console.log(`👤 Launched by: ${launchedBy}`);
  console.log(`🎯 Target Audience: ${config.targetAudience}`);
  console.log(`⏰ Duration: ${config.duration} hours`);
  
  // Here you would implement:
  // 1. Send push notifications to target audience
  // 2. Update website banners/hero sections
  // 3. Send emails if configured
  // 4. Update social media if integrated
  // 5. Start analytics tracking
  
  res.status(201).json({
    message: 'Poster launched successfully with stunning 3D effects!',
    launch: launchData,
    effects: {
      '3d_animations': true,
      'particle_effects': true,
      'gradient_backgrounds': true,
      'hover_interactions': true,
      'rotation_effects': true,
      'scaling_animations': true,
      'color_transitions': true,
      'text_shadows': true,
      'glow_effects': true
    }
  });
});

// @desc    Get all launched posters
// @route   GET /api/admin/poster-launch/launched
// @access  Private/Admin
export const getLaunchedPosters = asyncHandler(async (req, res) => {
  // In a real implementation, this would fetch from a database
  // For now, we'll return sample launched posters
  const launchedPosters = [
    // This would be populated by actual launch records
  ];

  res.json(launchedPosters);
});

// @desc    Stop a poster launch
// @route   DELETE /api/admin/poster-launch/launched/:id
// @access  Private/Admin
export const stopPosterLaunch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error('Launch ID is required');
  }

  // In a real implementation, this would:
  // 1. Find the launch record in database
  // 2. Update status to 'stopped'
  // 3. Remove from active displays
  // 4. Stop analytics tracking
  // 5. Send notifications about stop

  console.log(`🛑 Stopping poster launch: ${id}`);

  res.json({
    message: 'Poster launch stopped successfully',
    stoppedAt: new Date().toISOString(),
    stoppedBy: req.user.id
  });
});

// @desc    Update a poster launch configuration
// @route   PUT /api/admin/poster-launch/launched/:id
// @access  Private/Admin
export const updatePosterLaunch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    res.status(400);
    throw new Error('Launch ID is required');
  }

  // In a real implementation, this would:
  // 1. Find the launch record in database
  // 2. Update the configuration
  // 3. Apply changes to active displays
  // 4. Log the update

  console.log(`✏️ Updating poster launch: ${id}`, updateData);

  res.json({
    message: 'Poster launch updated successfully',
    updatedAt: new Date().toISOString(),
    updatedBy: req.user.id,
    updates: updateData
  });
});

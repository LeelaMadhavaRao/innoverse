import asyncHandler from 'express-async-handler';
import Evaluation from '../models/evaluation.model.js';
import Team from '../models/team.model.js';
import Evaluator from '../models/evaluator.model.js';
import User from '../models/user.model.js';

// ==================== EVALUATOR EVALUATION ENDPOINTS ====================

// @desc    Get all teams available for evaluation (no assignment restrictions)
// @route   GET /api/evaluations/evaluator/teams
// @access  Private/Evaluator
export const getEvaluatorTeams = asyncHandler(async (req, res) => {
  try {
    console.log('🔍 Getting evaluator teams for user:', req.user._id);
    
    const evaluator = await Evaluator.findOne({ userId: req.user._id }).lean();

    if (!evaluator) {
      res.status(404);
      throw new Error('Evaluator profile not found');
    }

    console.log('👤 Found evaluator:', evaluator.name);

    // Get all teams available for evaluation with minimal data
    const allTeams = await Team.find({})
      .select('teamName teamLeader projectDetails status createdAt')
      .lean()
      .limit(50); // Limit to prevent timeout

    console.log('📋 Found teams:', allTeams.length);

    // Get existing evaluations for this evaluator in a single query
    const existingEvaluations = await Evaluation.find({ evaluatorId: req.user._id })
      .select('teamId totalScore createdAt')
      .lean();
    
    console.log('✅ Found evaluations:', existingEvaluations.length);

    const evaluatedTeamIds = new Set(existingEvaluations.map(evaluation => evaluation.teamId.toString()));

    // Add evaluation status to all teams
    const teamsWithStatus = allTeams.map(team => {
      const isEvaluated = evaluatedTeamIds.has(team._id.toString());
      const evaluation = existingEvaluations.find(evaluation => evaluation.teamId.toString() === team._id.toString());
      
      return {
        _id: team._id,
        teamName: team.teamName,
        teamLeader: team.teamLeader,
        projectTitle: team.projectDetails?.projectTitle || 'No title',
        status: team.status,
        evaluationStatus: isEvaluated ? 'completed' : 'pending',
        evaluationScore: evaluation ? evaluation.totalScore : null,
        evaluationDate: evaluation ? evaluation.createdAt : null,
        evaluationId: evaluation ? evaluation._id : null
      };
    });

    const response = {
      evaluator: {
        name: evaluator.name,
        email: evaluator.email,
        organization: evaluator.organization,
        totalAvailable: allTeams.length,
        completed: existingEvaluations.length,
        remaining: allTeams.length - existingEvaluations.length
      },
      teams: teamsWithStatus
    };

    console.log('📤 Sending response with', teamsWithStatus.length, 'teams');
    res.json(response);
  } catch (error) {
    console.error('❌ Error in getEvaluatorTeams:', error);
    res.status(500).json({ 
      message: 'Failed to fetch teams for evaluation', 
      error: error.message 
    });
  }
});

// @desc    Get evaluator's completed evaluations
// @route   GET /api/evaluations/evaluator/evaluations
// @access  Private/Evaluator
export const getEvaluatorEvaluations = asyncHandler(async (req, res) => {
  const evaluator = await Evaluator.findOne({ userId: req.user._id });
  if (!evaluator) {
    res.status(404);
    throw new Error('Evaluator profile not found');
  }

  // Get all evaluations submitted by this evaluator
  const evaluations = await Evaluation.find({ evaluatorId: req.user._id })
    .populate('teamId', 'teamName teamLeader projectDetails')
    .sort({ createdAt: -1 });

  res.json({
    evaluator: {
      name: evaluator.name,
      email: evaluator.email,
      organization: evaluator.organization
    },
    evaluations: evaluations.map(evaluation => ({
      _id: evaluation._id,
      teamName: evaluation.teamId.teamName,
      teamLeader: evaluation.teamId.teamLeader,
      projectDetails: evaluation.teamId.projectDetails,
      criteria: evaluation.criteria,
      totalScore: evaluation.totalScore,
      feedback: evaluation.feedback,
      submittedAt: evaluation.createdAt,
      status: 'completed'
    })),
    totalEvaluations: evaluations.length
  });
});

// @desc    Get specific team details for evaluation
// @route   GET /api/evaluations/team/:teamId
// @access  Private/Evaluator
export const getTeamForEvaluation = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  // Verify evaluator exists
  const evaluator = await Evaluator.findOne({ userId: req.user._id });
  if (!evaluator) {
    res.status(404);
    throw new Error('Evaluator profile not found');
  }

  // Get team details (no assignment check - all teams available)
  const team = await Team.findById(teamId);
  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if already evaluated
  const existingEvaluation = await Evaluation.findOne({
    teamId,
    evaluatorId: req.user._id
  });

  res.json({
    team,
    alreadyEvaluated: !!existingEvaluation,
    existingEvaluation: existingEvaluation || null
  });
});

// @desc    Submit team evaluation
// @route   POST /api/evaluations/submit
// @access  Private/Evaluator
export const submitEvaluation = asyncHandler(async (req, res) => {
  const { teamId, criteria, feedback, totalScore } = req.body;

  // Validate required fields
  if (!teamId || !criteria || totalScore === undefined) {
    res.status(400);
    throw new Error('Team ID, criteria scores, and total score are required');
  }

  // Validate criteria structure
  const requiredCriteria = ['problemStatement', 'teamInvolvement', 'leanCanvas', 'prototypeQuality'];
  for (const criterion of requiredCriteria) {
    if (criteria[criterion] === undefined || criteria[criterion] < 0 || criteria[criterion] > 25) {
      res.status(400);
      throw new Error(`Invalid score for ${criterion}. Must be between 0 and 25.`);
    }
  }

  // Validate total score
  const calculatedTotal = Object.values(criteria).reduce((sum, score) => sum + score, 0);
  if (Math.abs(calculatedTotal - totalScore) > 0.1) {
    res.status(400);
    throw new Error('Total score does not match sum of criteria scores');
  }

  // Check if evaluator exists (no assignment restrictions)
  const evaluator = await Evaluator.findOne({ userId: req.user._id });
  if (!evaluator) {
    res.status(404);
    throw new Error('Evaluator profile not found');
  }

  // Check if already evaluated
  const existingEvaluation = await Evaluation.findOne({
    teamId,
    evaluatorId: req.user._id
  });

  if (existingEvaluation) {
    res.status(400);
    throw new Error('You have already evaluated this team');
  }

  // Create evaluation
  const evaluation = await Evaluation.create({
    teamId,
    evaluatorId: req.user._id,
    criteria,
    feedback: feedback || '',
    totalScore,
    submittedAt: new Date(),
    status: 'submitted'
  });

  // Update team's evaluation scores
  const team = await Team.findById(teamId);
  team.evaluationScores.push({
    evaluatorId: req.user._id,
    score: totalScore,
    criteria,
    feedback,
    submittedAt: new Date()
  });

  // Calculate if all evaluations are complete
  const totalEvaluators = await Evaluator.countDocuments();
  if (team.evaluationScores.length >= totalEvaluators) {
    team.evaluationStatus = 'completed';
    team.finalScore = team.calculateAverageScore();
  }

  await team.save();

  // Update evaluator stats
  evaluator.evaluationsCompleted += 1;
  await evaluator.save();

  res.status(201).json({
    message: 'Evaluation submitted successfully',
    evaluation,
    teamStatus: team.evaluationStatus
  });
});

// @desc    Update existing evaluation
// @route   PUT /api/evaluations/:evaluationId
// @access  Private/Evaluator
export const updateEvaluation = asyncHandler(async (req, res) => {
  const { evaluationId } = req.params;
  const { criteria, feedback, totalScore } = req.body;

  const evaluation = await Evaluation.findById(evaluationId);
  if (!evaluation) {
    res.status(404);
    throw new Error('Evaluation not found');
  }

  // Check if evaluator owns this evaluation
  if (evaluation.evaluatorId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only update your own evaluations');
  }

  // Update evaluation
  if (criteria) evaluation.criteria = criteria;
  if (feedback !== undefined) evaluation.feedback = feedback;
  if (totalScore !== undefined) evaluation.totalScore = totalScore;
  evaluation.updatedAt = new Date();

  await evaluation.save();

  // Update team's evaluation scores
  const team = await Team.findById(evaluation.teamId);
  const scoreIndex = team.evaluationScores.findIndex(
    score => score.evaluatorId.toString() === req.user._id.toString()
  );

  if (scoreIndex !== -1) {
    team.evaluationScores[scoreIndex] = {
      evaluatorId: req.user._id,
      score: totalScore || evaluation.totalScore,
      criteria: criteria || evaluation.criteria,
      feedback: feedback !== undefined ? feedback : evaluation.feedback,
      submittedAt: evaluation.submittedAt,
      updatedAt: new Date()
    };

    // Recalculate final score
    team.finalScore = team.calculateAverageScore();
    await team.save();
  }

  res.json({
    message: 'Evaluation updated successfully',
    evaluation
  });
});

// @desc    Get evaluator's own profile
// @route   GET /api/evaluations/evaluator/profile
// @access  Private/Evaluator
export const getEvaluatorProfile = asyncHandler(async (req, res) => {
  const evaluator = await Evaluator.findOne({ userId: req.user._id })
    .populate('assignedTeams.teamId', 'teamName teamLeader projectDetails status');

  if (!evaluator) {
    res.status(404);
    throw new Error('Evaluator profile not found');
  }

  // Get evaluation statistics
  const totalEvaluations = await Evaluation.countDocuments({ evaluatorId: req.user._id });
  const assignedTeamsCount = evaluator.assignedTeams.length;

  res.json({
    profile: {
      _id: evaluator._id,
      name: evaluator.name,
      email: evaluator.email,
      organization: evaluator.organization,
      designation: evaluator.designation,
      type: evaluator.type,
      expertise: evaluator.expertise,
      experience: evaluator.experience,
      phone: evaluator.phone,
      status: evaluator.status,
      createdAt: evaluator.createdAt
    },
    statistics: {
      totalAssigned: assignedTeamsCount,
      totalCompleted: totalEvaluations,
      totalRemaining: assignedTeamsCount - totalEvaluations,
      completionRate: assignedTeamsCount > 0 ? Math.round((totalEvaluations / assignedTeamsCount) * 100) : 0
    }
  });
});

// @desc    Update evaluator's own profile
// @route   PUT /api/evaluations/evaluator/profile
// @access  Private/Evaluator
export const updateEvaluatorProfile = asyncHandler(async (req, res) => {
  const { name, organization, designation, experience, phone, expertise } = req.body;

  const evaluator = await Evaluator.findOne({ userId: req.user._id });
  if (!evaluator) {
    res.status(404);
    throw new Error('Evaluator profile not found');
  }

  // Update fields that evaluators are allowed to modify
  if (name) evaluator.name = name;
  if (organization) evaluator.organization = organization;
  if (designation) evaluator.designation = designation;
  if (experience) evaluator.experience = experience;
  if (phone) evaluator.phone = phone;
  if (expertise && Array.isArray(expertise)) evaluator.expertise = expertise;

  const updatedEvaluator = await evaluator.save();

  // Also update the linked user name if provided
  if (name) {
    await User.findByIdAndUpdate(req.user._id, { name });
  }

  res.json({
    message: 'Profile updated successfully',
    profile: {
      _id: updatedEvaluator._id,
      name: updatedEvaluator.name,
      email: updatedEvaluator.email,
      organization: updatedEvaluator.organization,
      designation: updatedEvaluator.designation,
      type: updatedEvaluator.type,
      expertise: updatedEvaluator.expertise,
      experience: updatedEvaluator.experience,
      phone: updatedEvaluator.phone,
      status: updatedEvaluator.status
    }
  });
});

// ==================== ADMIN EVALUATION MANAGEMENT ====================

// @desc    Get all evaluations with statistics
// @route   GET /api/evaluations/admin/overview
// @access  Private/Admin
export const getEvaluationOverview = asyncHandler(async (req, res) => {
  // Get all teams with their evaluation scores
  const teams = await Team.find()
    .populate('evaluationScores.evaluatorId', 'name email organization')
    .sort({ finalScore: -1 });

  // Get all evaluators with their stats
  const evaluators = await Evaluator.find()
    .populate('userId', 'name email')
    .select('name email organization type evaluationsCompleted totalEvaluationsAssigned');

  // Calculate overall statistics
  const totalTeams = teams.length;
  const totalEvaluators = evaluators.length;
  const totalPossibleEvaluations = totalTeams * totalEvaluators;
  const completedEvaluations = teams.reduce((sum, team) => sum + team.evaluationScores.length, 0);
  const completionPercentage = totalPossibleEvaluations > 0 
    ? ((completedEvaluations / totalPossibleEvaluations) * 100).toFixed(1)
    : 0;

  // Calculate team rankings
  const rankedTeams = teams
    .filter(team => team.evaluationScores.length > 0)
    .map((team, index) => ({
      ...team.toObject(),
      rank: index + 1,
      averageScore: team.calculateAverageScore(),
      evaluationsCompleted: team.evaluationScores.length,
      evaluationsRemaining: totalEvaluators - team.evaluationScores.length,
      completionPercentage: ((team.evaluationScores.length / totalEvaluators) * 100).toFixed(1)
    }));

  res.json({
    statistics: {
      totalTeams,
      totalEvaluators,
      totalPossibleEvaluations,
      completedEvaluations,
      completionPercentage,
      teamsFullyEvaluated: teams.filter(team => team.evaluationStatus === 'completed').length
    },
    teams: rankedTeams,
    evaluators: evaluators.map(evaluator => ({
      ...evaluator.toObject(),
      completionRate: evaluator.totalEvaluationsAssigned > 0 
        ? ((evaluator.evaluationsCompleted / evaluator.totalEvaluationsAssigned) * 100).toFixed(1)
        : 0
    }))
  });
});

// @desc    Get detailed evaluations for a specific team
// @route   GET /api/evaluations/admin/team/:teamId
// @access  Private/Admin
export const getTeamEvaluationDetails = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId)
    .populate('evaluationScores.evaluatorId', 'name email organization type');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Get detailed evaluations
  const detailedEvaluations = await Evaluation.find({ teamId })
    .populate('evaluatorId', 'name email organization type');

  res.json({
    team,
    evaluations: detailedEvaluations,
    averageScore: team.calculateAverageScore(),
    evaluationStatus: team.evaluationStatus
  });
});

// @desc    Release results
// @route   POST /api/evaluations/admin/release-results
// @access  Private/Admin
export const releaseResults = asyncHandler(async (req, res) => {
  // Check if all evaluations are complete
  const teams = await Team.find();
  const totalEvaluators = await Evaluator.countDocuments();

  const incompleteTeams = teams.filter(team => 
    team.evaluationScores.length < totalEvaluators
  );

  if (incompleteTeams.length > 0) {
    res.status(400);
    throw new Error(`Cannot release results. ${incompleteTeams.length} teams still have pending evaluations.`);
  }

  // Calculate final rankings
  const rankedTeams = teams
    .map(team => ({
      teamId: team._id,
      teamName: team.teamName,
      finalScore: team.calculateAverageScore()
    }))
    .sort((a, b) => b.finalScore - a.finalScore);

  // Update team rankings
  for (let i = 0; i < rankedTeams.length; i++) {
    await Team.findByIdAndUpdate(rankedTeams[i].teamId, {
      finalRank: i + 1,
      resultsReleased: true,
      resultsReleasedAt: new Date()
    });
  }

  res.json({
    message: 'Results released successfully',
    releasedAt: new Date(),
    rankings: rankedTeams.map((team, index) => ({
      ...team,
      rank: index + 1
    }))
  });
});

// ==================== TEAM/FACULTY RESULTS ENDPOINTS ====================

// @desc    Get results for team view
// @route   GET /api/evaluations/results/team
// @access  Private/Team
export const getTeamResults = asyncHandler(async (req, res) => {
  // Get team from user
  const team = await Team.findOne({ 'teamLeader.email': req.user.email })
    .populate('evaluationScores.evaluatorId', 'name email organization');

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if results are released
  if (!team.resultsReleased) {
    res.status(403);
    throw new Error('Results have not been released yet');
  }

  // Get all teams for ranking context
  const allTeams = await Team.find({ resultsReleased: true })
    .sort({ finalRank: 1 })
    .select('teamName finalScore finalRank');

  res.json({
    team: {
      teamName: team.teamName,
      finalScore: team.finalScore,
      finalRank: team.finalRank,
      evaluationScores: team.evaluationScores,
      resultsReleasedAt: team.resultsReleasedAt
    },
    rankings: allTeams.map(t => ({
      teamName: t.teamName,
      finalScore: t.finalScore,
      rank: t.finalRank,
      isCurrentTeam: t._id.toString() === team._id.toString()
    }))
  });
});

// @desc    Get results for faculty view
// @route   GET /api/evaluations/results/faculty
// @access  Private/Faculty
export const getFacultyResults = asyncHandler(async (req, res) => {
  // Get all teams with released results
  const teams = await Team.find({ resultsReleased: true })
    .populate('evaluationScores.evaluatorId', 'name email organization')
    .sort({ finalRank: 1 });

  if (teams.length === 0) {
    res.status(404);
    throw new Error('No results have been released yet');
  }

  // Calculate statistics
  const totalTeams = teams.length;
  const averageScore = teams.reduce((sum, team) => sum + team.finalScore, 0) / totalTeams;
  const highestScore = Math.max(...teams.map(team => team.finalScore));
  const lowestScore = Math.min(...teams.map(team => team.finalScore));

  res.json({
    statistics: {
      totalTeams,
      averageScore: Math.round(averageScore * 10) / 10,
      highestScore,
      lowestScore,
      resultsReleasedAt: teams[0].resultsReleasedAt
    },
    rankings: teams.map(team => ({
      teamId: team._id,
      teamName: team.teamName,
      teamLeader: team.teamLeader,
      projectTitle: team.projectDetails?.title || 'Project Title',
      finalScore: team.finalScore,
      rank: team.finalRank,
      evaluationScores: team.evaluationScores,
      averageScore: team.calculateAverageScore()
    }))
  });
});

// @desc    Get evaluation criteria and guidelines
// @route   GET /api/evaluations/criteria
// @access  Private
export const getEvaluationCriteria = asyncHandler(async (req, res) => {
  const criteria = {
    overview: {
      totalScore: 100,
      criteriaCount: 4,
      scoringScale: '0-25 points per criterion'
    },
    criteria: [
      {
        id: 'problemStatement',
        name: 'Problem Statement',
        description: 'Clarity and significance of the problem being addressed',
        maxScore: 25,
        guidelines: [
          'Problem is clearly defined and well-articulated',
          'Market need and target audience are identified',
          'Problem significance and impact are demonstrated',
          'Research and validation of problem existence'
        ]
      },
      {
        id: 'teamInvolvement',
        name: 'Team Involvement',
        description: 'Active participation and collaboration of all team members',
        maxScore: 25,
        guidelines: [
          'All team members are actively engaged',
          'Clear role distribution and responsibilities',
          'Effective collaboration and communication',
          'Evidence of collective contribution'
        ]
      },
      {
        id: 'leanCanvas',
        name: 'Lean Canvas',
        description: 'Business model viability and strategic planning',
        maxScore: 25,
        guidelines: [
          'Comprehensive business model canvas',
          'Clear value proposition and revenue streams',
          'Market analysis and competitive landscape',
          'Feasible go-to-market strategy'
        ]
      },
      {
        id: 'prototypeQuality',
        name: 'Prototype Quality',
        description: 'Technical implementation and innovation level',
        maxScore: 25,
        guidelines: [
          'Functional prototype or detailed mockup',
          'Technical innovation and creativity',
          'User experience and interface design',
          'Scalability and technical feasibility'
        ]
      }
    ]
  };

  res.json(criteria);
});

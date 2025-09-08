import User from '../models/User.js';
import Team from '../models/Team.js';
import Gallery from '../models/Gallery.js';
import Evaluation from '../models/Evaluation.js';
import LaunchedPoster from '../models/LaunchedPoster.js';
import bcrypt from 'bcryptjs';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeams = await Team.countDocuments();
    const totalGalleryItems = await Gallery.countDocuments();
    const totalEvaluations = await Evaluation.countDocuments();
    const launchedPosters = await LaunchedPoster.countDocuments();

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password');
    const recentTeams = await Team.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalUsers,
        totalTeams,
        totalGalleryItems,
        totalEvaluations,
        launchedPosters
      },
      recentUsers,
      recentTeams
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    const userResponse = await User.findById(user._id).select('-password');
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all teams
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({}).sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new team
export const createTeam = async (req, res) => {
  try {
    const teamData = req.body;
    
    const teamExists = await Team.findOne({ teamName: teamData.teamName });
    if (teamExists) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    const team = await Team.create(teamData);
    res.status(201).json(team);
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all team emails
export const getEmails = async (req, res) => {
  try {
    const teams = await Team.find({});
    const emails = teams.map(team => ({
      teamName: team.teamName,
      email: team.teamLeader.email,
      credentials: team.credentials
    }));
    res.json(emails);
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get faculty
export const getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' }).select('-password');
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create faculty
export const createFaculty = async (req, res) => {
  try {
    const facultyData = { ...req.body, role: 'faculty' };
    
    const userExists = await User.findOne({ email: facultyData.email });
    if (userExists) {
      return res.status(400).json({ message: 'Faculty member already exists' });
    }

    const faculty = await User.create(facultyData);
    const facultyResponse = await User.findById(faculty._id).select('-password');
    
    res.status(201).json(facultyResponse);
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get evaluators
export const getEvaluators = async (req, res) => {
  try {
    const evaluators = await User.find({ role: 'evaluator' }).select('-password');
    res.json(evaluators);
  } catch (error) {
    console.error('Get evaluators error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create evaluator
export const createEvaluator = async (req, res) => {
  try {
    const evaluatorData = { ...req.body, role: 'evaluator' };
    
    const userExists = await User.findOne({ email: evaluatorData.email });
    if (userExists) {
      return res.status(400).json({ message: 'Evaluator already exists' });
    }

    const evaluator = await User.create(evaluatorData);
    const evaluatorResponse = await User.findById(evaluator._id).select('-password');
    
    res.status(201).json(evaluatorResponse);
  } catch (error) {
    console.error('Create evaluator error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get evaluations
export const getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({})
      .populate('teamId', 'teamName teamLeader')
      .populate('evaluatorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(evaluations);
  } catch (error) {
    console.error('Get evaluations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

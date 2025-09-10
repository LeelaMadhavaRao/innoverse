import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('\n🔐 === PASSWORD VERIFICATION DEBUG ===');
  console.log('📧 Login attempt for email:', email);
  console.log('🔑 User input password:', password);
  console.log('🔑 Password length:', password ? password.length : 0);

  const user = await User.findOne({ email });

  if (user) {
    console.log('👤 User found in database:', user.name);
    console.log('🔒 Stored password hash:', user.password);
    console.log('🔒 Hash length:', user.password ? user.password.length : 0);
    console.log('👥 User role:', user.role);
    console.log('✅ Team leader status:', user.isTeamLeader || false);
    
    // Check if user has team credentials
    if (user.role === 'team') {
      const Team = (await import('../models/team.model.js')).default;
      const team = await Team.findOne({ 'teamLeader.email': email });
      if (team && team.credentials) {
        console.log('👥 Team found:', team.teamName);
        console.log('🔑 Team stored password:', team.credentials.password);
        console.log('📧 Team stored username:', team.credentials.username);
        console.log('🔍 Password comparison:');
        console.log('   Input password:', password);
        console.log('   Team password:', team.credentials.password);
        console.log('   Passwords match:', password === team.credentials.password);
      } else {
        console.log('❌ No team found or no team credentials');
      }
    }
    
    console.log('🔍 Starting bcrypt password verification...');
    const passwordMatch = await user.matchPassword(password);
    console.log('✅ Bcrypt verification result:', passwordMatch);
    
    if (passwordMatch) {
      console.log('🎉 Login successful for:', user.name);
      const token = generateToken(user._id);
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      
      res.json({
        token,
        user: userData
      });
    } else {
      console.log('❌ Password verification failed for:', user.name);
      console.log('❌ Input password:', password);
      console.log('❌ Stored hash:', user.password);
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } else {
    console.log('❌ No user found with email:', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }
  
  console.log('🔐 === END PASSWORD VERIFICATION DEBUG ===\n');
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

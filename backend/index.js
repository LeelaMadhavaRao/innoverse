import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Innoverse Backend...');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '***SET***' : 'NOT SET');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');

// Initialize express
const app = express();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// ============================================================================
// DATABASE CONNECTION
// ============================================================================
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not found. Database features will be disabled.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

// Connect to database
connectDB();

// ============================================================================
// MONGOOSE SCHEMAS
// ============================================================================

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'evaluator', 'team', 'faculty'], default: 'team' },
  name: { type: String, required: true },
  phone: String,
  profileImage: String,
  status: { type: String, enum: ['active', 'inactive', 'pending', 'suspended'], default: 'active' },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

// Team Schema
const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  teamLeader: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rollNumber: { type: String, required: true },
    year: { type: String, required: true },
    branch: { type: String, required: true }
  },
  teamMembers: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rollNumber: { type: String, required: true },
    year: { type: String, required: true },
    branch: { type: String, required: true }
  }],
  credentials: {
    username: { type: String, required: true },
    password: { type: String, required: true }
  },
  college: { type: String, required: true },
  projectTitle: String,
  projectDescription: String,
  techStack: [String],
  status: { type: String, enum: ['registered', 'submitted', 'evaluated'], default: 'registered' },
  submissionDate: Date,
  evaluationScore: Number,
  evaluatorComments: String,
  createdAt: { type: Date, default: Date.now }
});

const Team = mongoose.model('Team', teamSchema);

// Gallery Schema
const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploaderEmail: { type: String, required: true },
  uploaderRole: { type: String, required: true },
  category: { type: String, enum: ['event', 'team', 'general'], default: 'general' },
  tags: [String],
  isApproved: { type: Boolean, default: false },
  approvedBy: String,
  approvedAt: Date,
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', gallerySchema);

// Evaluation Schema
const evaluationSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scores: {
    innovation: { type: Number, min: 0, max: 10 },
    technical: { type: Number, min: 0, max: 10 },
    presentation: { type: Number, min: 0, max: 10 },
    feasibility: { type: Number, min: 0, max: 10 },
    impact: { type: Number, min: 0, max: 10 }
  },
  totalScore: Number,
  comments: String,
  feedback: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  evaluatedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

// ============================================================================
// MIDDLEWARE FUNCTIONS
// ============================================================================

// JWT token generation
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '30d' });
};

// Auth middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

// Evaluator middleware
const isEvaluator = (req, res, next) => {
  if (req.user && req.user.role === 'evaluator') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as evaluator' });
  }
};

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ============================================================================
// HEALTH CHECK ROUTES
// ============================================================================
app.get('/', (req, res) => {
  res.json({
    message: 'Innoverse Backend API is running! 🚀',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: ['/api/auth', '/api/admin', '/api/evaluations', '/api/gallery', '/api/team', '/api/poster-launch']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for:', email);

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================================================
// ADMIN ROUTES
// ============================================================================
app.get('/api/admin/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/emails', protect, isAdmin, async (req, res) => {
  try {
    const teams = await Team.find({});
    const emails = teams.map(team => ({
      teamName: team.teamName,
      email: team.teamLeader.email,
      credentials: team.credentials
    }));
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================================================
// GALLERY ROUTES
// ============================================================================
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await Gallery.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/gallery', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // In a real implementation, you'd upload to cloud storage here
    const imageUrl = `https://placeholder.com/400x300?text=${encodeURIComponent(title)}`;
    
    const galleryItem = await Gallery.create({
      title,
      description,
      imageUrl,
      uploadedBy: req.user.name,
      uploaderEmail: req.user.email,
      uploaderRole: req.user.role,
      category
    });

    res.status(201).json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/gallery/:id/approve', protect, isAdmin, async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    gallery.isApproved = true;
    gallery.approvedBy = req.user.name;
    gallery.approvedAt = new Date();
    await gallery.save();

    res.json({ message: 'Gallery item approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================================================
// TEAM ROUTES
// ============================================================================
app.get('/api/team/profile', protect, async (req, res) => {
  try {
    const team = await Team.findOne({ 'teamLeader.email': req.user.email });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/team/profile', protect, async (req, res) => {
  try {
    const team = await Team.findOne({ 'teamLeader.email': req.user.email });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    Object.assign(team, req.body);
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================================================
// EVALUATION ROUTES
// ============================================================================
app.get('/api/evaluations', protect, isEvaluator, async (req, res) => {
  try {
    const teams = await Team.find({ status: 'submitted' });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/evaluations', protect, isEvaluator, async (req, res) => {
  try {
    const { teamId, scores, comments, feedback } = req.body;
    
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    const evaluation = await Evaluation.create({
      teamId,
      evaluatorId: req.user._id,
      scores,
      totalScore,
      comments,
      feedback,
      status: 'completed',
      evaluatedAt: new Date()
    });

    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ============================================================================
// POSTER LAUNCH ROUTES
// ============================================================================
app.get('/api/poster-launch/test', (req, res) => {
  res.json({ 
    message: 'Poster launch routes are working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/poster-launch/public/launched', (req, res) => {
  try {
    const samplePosters = [
      {
        posterId: 'poster-innoverse-2025',
        title: 'Innoverse 2025 - Innovation Challenge',
        subtitle: 'Unleash Your Creative Potential',
        description: 'Join the most exciting innovation challenge of the year. Present your groundbreaking ideas and compete for amazing prizes.',
        imageUrl: '/innoverse.jpg',
        theme: 'innovation',
        date: new Date().toISOString(),
        organizer: 'Innoverse Team',
        launchedAt: new Date().toISOString(),
        analytics: { views: 0, interactions: 0 }
      },
      {
        posterId: 'poster-potluck-2025',
        title: 'Community Potluck Event',
        subtitle: 'Bringing Innovation Together',
        description: 'A community gathering to share ideas, network, and celebrate innovation in technology.',
        imageUrl: '/potluck.jpg',
        theme: 'community',
        date: new Date().toISOString(),
        organizer: 'Innoverse Team',
        launchedAt: new Date().toISOString(),
        analytics: { views: 0, interactions: 0 }
      }
    ];

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

app.get('/api/poster-launch/config', protect, (req, res) => {
  const config = {
    isLaunchEnabled: true,
    maxPosters: 10,
    currentCount: 2,
    lastUpdated: new Date().toISOString()
  };
  res.json(config);
});

app.get('/api/poster-launch/events', (req, res) => {
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
});

// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl 
  });
});

console.log('🎉 Server initialization complete');

// Export for Vercel serverless
export default app;

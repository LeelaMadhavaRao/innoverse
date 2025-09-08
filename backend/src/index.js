import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug: Check if environment variables are loaded (for deployment debugging)
console.log('🔍 Environment variables check:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '***SET***' : 'NOT SET');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');

// Debug: Check if environment variables are loaded
console.log('🔍 Environment variables check:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('  EMAIL_USER:', process.env.EMAIL_USER);
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');

// Import routes
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import teamRoutes from './routes/team.routes.js';
import posterLaunchRoutes from './routes/posterLaunch.routes.js';

// Initialize express
const app = express();

// Connect to MongoDB (don't await at top level)
connectDB().then(() => {
  console.log('✅ Database connected successfully');
}).catch((error) => {
  console.error('❌ Database connection failed:', error);
});

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://innoverse-frontend.vercel.app', // Add your frontend URL here when deployed
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
// Note: In production (Vercel), files will be temporary. Use cloud storage for permanent files.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route for health check
app.get('/', (req, res) => {
  res.json({
    message: 'Innoverse Backend API is running! 🚀',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/poster-launch', posterLaunchRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

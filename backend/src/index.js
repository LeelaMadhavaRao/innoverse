import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (only for local development)
if (process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

console.log('🔍 Environment check:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '***SET***' : 'NOT SET');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');

// Import routes with error handling
let authRoutes, adminRoutes, evaluationRoutes, galleryRoutes, teamRoutes, posterLaunchRoutes;

try {
  console.log('📦 Importing routes...');
  authRoutes = (await import('./routes/auth.routes.js')).default;
  adminRoutes = (await import('./routes/admin.routes.js')).default;
  evaluationRoutes = (await import('./routes/evaluation.routes.js')).default;
  galleryRoutes = (await import('./routes/gallery.routes.js')).default;
  teamRoutes = (await import('./routes/team.routes.js')).default;
  posterLaunchRoutes = (await import('./routes/posterLaunch.routes.js')).default;
  console.log('✅ All routes imported successfully');
} catch (error) {
  console.error('❌ Error importing routes:', error);
  throw error;
}

// Initialize express
const app = express();

// Connect to MongoDB (non-blocking)
try {
  connectDB().then(() => {
    console.log('✅ Database connected successfully');
  }).catch((error) => {
    console.error('❌ Database connection failed:', error);
    // Don't throw error - let server continue without DB for health checks
  });
} catch (error) {
  console.error('❌ Database setup error:', error);
}

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

// For Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

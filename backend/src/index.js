import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes directly
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import teamRoutes from './routes/team.routes.js';
import posterLaunchRoutes from './routes/posterLaunch.routes.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Innoverse Backend...');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '***SET***' : 'NOT SET');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');

// Initialize express
const app = express();

// Basic middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  'https://innoverse-n.vercel.app',
  'https://innoverse-sigma.vercel.app', // Your backend URL
  process.env.FRONTEND_URL,
  'http://localhost:5173', // For local development
  'http://localhost:3000', // For local development
  'http://localhost:5000', // For local development
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel domains
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow all origins for now to debug
    }
  },
  credentials: true
}));

// Health check route (must work even if other imports fail)
app.get('/', (req, res) => {
  try {
    res.json({
      message: 'Innoverse Backend API is running! 🚀',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      endpoints: [
        '/api/auth',
        '/api/admin', 
        '/api/evaluations',
        '/api/gallery',
        '/api/team',
        '/api/poster-launch'
      ]
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Initialize database connection
async function initializeDatabase() {
  try {
    const { connectDB } = await import('./config/db.js');
    await connectDB();
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Database failed:', error.message);
  }
}

// Initialize database (non-blocking)
initializeDatabase();

// Setup routes
try {
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Auth routes failed:', error.message);
}

try {
  app.use('/api/admin', adminRoutes);
  console.log('✅ Admin routes loaded');
} catch (error) {
  console.error('❌ Admin routes failed:', error.message);
}

try {
  app.use('/api/evaluations', evaluationRoutes);
  console.log('✅ Evaluation routes loaded');
} catch (error) {
  console.error('❌ Evaluation routes failed:', error.message);
}

try {
  app.use('/api/gallery', galleryRoutes);
  console.log('✅ Gallery routes loaded');
} catch (error) {
  console.error('❌ Gallery routes failed:', error.message);
}

try {
  app.use('/api/team', teamRoutes);
  console.log('✅ Team routes loaded');
} catch (error) {
  console.error('❌ Team routes failed:', error.message);
}

try {
  app.use('/api/poster-launch', posterLaunchRoutes);
  console.log('✅ Poster launch routes loaded');
} catch (error) {
  console.error('❌ Poster launch routes failed:', error.message);
}

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

console.log('🎉 Server initialization complete');

// Export for Vercel serverless
export default app;

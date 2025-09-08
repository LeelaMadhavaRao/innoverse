import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes directly
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import evaluationRoutes from './routes/evaluation.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import teamRoutes from './routes/team.routes.js';
import posterLaunchRoutes from './routes/posterLaunch.routes.js';

console.log('🚀 Starting Innoverse Backend...');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '***SET***' : 'NOT SET');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');

// Initialize express
const app = express();

// Enable trust proxy for Vercel
app.set('trust proxy', 1);

// CORS configuration - more permissive for debugging
app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  optionsSuccessStatus: 200
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Basic middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Health check route (must work even if other imports fail)
app.get('/', (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    res.json({
      message: 'Innoverse Backend API is running! 🚀',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      cors: 'enabled',
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cors: 'working'
  });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.json({
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Explicit OPTIONS handler for all API routes
app.options('/api/*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(200).end();
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

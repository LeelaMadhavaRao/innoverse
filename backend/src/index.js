import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes directly
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import posterLaunchRoutes from './routes/posterLaunchRoutes.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://innoverse-n.vercel.app',
    'https://innoverse-sigma.vercel.app',
    'https://innoverse-orpin.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Innoverse Backend API',
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Innoverse API v1.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      gallery: '/api/gallery',
      team: '/api/team',
      evaluations: '/api/evaluations',
      posterLaunch: '/api/poster-launch'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/poster-launch', posterLaunchRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: [
      '/api/auth',
      '/api/admin', 
      '/api/gallery',
      '/api/team',
      '/api/evaluations',
      '/api/poster-launch'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;

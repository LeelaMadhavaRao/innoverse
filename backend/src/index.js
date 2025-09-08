import express from 'express';

const app = express();

console.log('🚀 Backend starting...');

// Super simple CORS handler
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS preflight request');
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  console.log('✅ Root endpoint hit');
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/health', (req, res) => {
  console.log('✅ Health check endpoint hit');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Simple auth route for testing
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body);
  res.json({ 
    token: 'test-token-' + Date.now(),
    user: { 
      _id: '1',
      name: 'Test User',
      email: req.body.email,
      role: 'admin'
    }
  });
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`❓ Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl 
  });
});

console.log('🎉 Backend initialized');

export default app;

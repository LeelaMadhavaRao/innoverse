import express from 'express';

const app = express();

// Super simple CORS handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Simple auth route for testing
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  res.json({ 
    token: 'test-token',
    user: { 
      _id: '1',
      name: 'Test User',
      email: req.body.email,
      role: 'admin'
    }
  });
});

export default app;

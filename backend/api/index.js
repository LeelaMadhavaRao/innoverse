// Simple serverless function for Vercel
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`${req.method} ${req.url}`);

  // Route handling
  if (req.url === '/' || req.url === '/api') {
    res.status(200).json({
      message: 'Backend is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url
    });
    return;
  }

  if (req.url === '/api/auth/login' && req.method === 'POST') {
    const body = req.body || {};
    console.log('Login attempt:', body);
    
    res.status(200).json({
      token: 'test-token-' + Date.now(),
      user: {
        _id: '1',
        name: 'Test User',
        email: body.email || 'test@example.com',
        role: 'admin'
      }
    });
    return;
  }

  if (req.url === '/health') {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // 404 for other routes
  res.status(404).json({
    message: 'Route not found',
    method: req.method,
    url: req.url
  });
}

const axios = require('axios');

const API_BASE_URL = 'https://inno-backend-y1bv.onrender.com/api';

async function testUserRole() {
  try {
    console.log('🔍 Testing user role...');
    
    // Get token from localStorage (simulate browser environment)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzM4YzA2YjY0YjZkZGI5ODlmYzVkOGMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzE4MzYwMzMsImV4cCI6MTczMjQ0MDgzM30.UBUP8tUKFFhvYGqR5YGwsJfUpXGzPeVr7z48-xyxqeY'; // Admin token from test
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Test /api/auth/me endpoint to get current user info
    const response = await axios.get(`${API_BASE_URL}/auth/me`, { headers });
    console.log('✅ Current user info:', response.data);
    
    // Also test admin/evaluations access
    try {
      const adminResponse = await axios.get(`${API_BASE_URL}/admin/evaluations`, { headers });
      console.log('✅ Admin evaluations access: SUCCESS');
      console.log('  Teams count:', adminResponse.data.length);
    } catch (adminError) {
      console.log('❌ Admin evaluations access: FAILED');
      console.log('  Error:', adminError.response?.status, adminError.response?.data?.message);
    }
    
    // Test evaluator access
    try {
      const evalResponse = await axios.get(`${API_BASE_URL}/evaluations/evaluator/teams`, { headers });
      console.log('✅ Evaluator teams access: SUCCESS');
      console.log('  Teams count:', evalResponse.data.teams?.length || 'no teams data');
    } catch (evalError) {
      console.log('❌ Evaluator teams access: FAILED');
      console.log('  Error:', evalError.response?.status, evalError.response?.data?.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing user role:', error.message);
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    }
  }
}

testUserRole();
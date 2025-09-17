// Test evaluator API endpoint
const API_BASE_URL = 'https://inno-backend-y1bv.onrender.com/api';

async function testEvaluatorEndpoint() {
  console.log('🚀 Testing Evaluator API Endpoint...\n');

  // Test basic health check
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const health = await healthResponse.json();
    console.log('✅ Health Check:', health.success ? 'PASSED' : 'FAILED');
  } catch (error) {
    console.log('❌ Health Check FAILED:', error.message);
  }

  // Test evaluator endpoint without auth (should get 401)
  try {
    console.log('\n🔐 Testing evaluator endpoint without auth...');
    const response = await fetch(`${API_BASE_URL}/admin/evaluator/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(60000) // 60 second timeout
    });
    
    console.log('Response Status:', response.status);
    
    if (response.status === 401) {
      console.log('✅ Authentication required (expected behavior)');
    } else {
      const data = await response.json();
      console.log('Response:', data);
    }
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('❌ Request timed out after 60 seconds');
    } else {
      console.log('❌ Network error:', error.message);
    }
  }

  // Test with mock auth header (should get proper error)
  try {
    console.log('\n🔑 Testing evaluator endpoint with mock auth...');
    const response = await fetch(`${API_BASE_URL}/admin/evaluator/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock-token'
      },
      signal: AbortSignal.timeout(60000) // 60 second timeout
    });
    
    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('❌ Request timed out after 60 seconds');
    } else {
      console.log('❌ Network error:', error.message);
    }
  }

  console.log('\n📝 Test Summary:');
  console.log('- Check backend logs for any errors');
  console.log('- Verify database connection is stable');
  console.log('- Consider optimizing queries if timeout persists');
  console.log('- Frontend should use credentials: leelamadhav.nulakani@gmail.com / evaluator123');
}

testEvaluatorEndpoint().catch(console.error);
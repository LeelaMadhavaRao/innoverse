/**
 * Backend Status Test for Evaluator Endpoints
 * Tests the current status of evaluator endpoints and provides deployment guidance
 */

const BACKEND_URL = 'https://inno-backend-y1bv.onrender.com';

console.log('🔧 Testing Backend Status for Evaluator Endpoints...\n');

async function testEndpoint(url, expectedStatus = null) {
  try {
    const response = await fetch(url);
    const status = response.status;
    const statusText = response.statusText;
    
    let statusIcon = '❓';
    let message = '';
    
    if (status === 401) {
      statusIcon = '✅';
      message = 'Endpoint exists and properly protected (needs auth)';
    } else if (status === 403) {
      statusIcon = '❌';
      message = 'Endpoint exists but has wrong permissions (admin-only)';
    } else if (status === 404) {
      statusIcon = '🚫';
      message = 'Endpoint does not exist';
    } else if (status === 200) {
      statusIcon = '⚠️';
      message = 'Endpoint accessible without auth (security issue)';
    } else {
      statusIcon = '❓';
      message = `Unexpected status: ${status}`;
    }
    
    console.log(`${statusIcon} ${url}`);
    console.log(`   Status: ${status} ${statusText}`);
    console.log(`   Assessment: ${message}\n`);
    
    return { status, message };
  } catch (error) {
    console.log(`❌ ${url}`);
    console.log(`   Error: ${error.message}\n`);
    return { status: 'ERROR', message: error.message };
  }
}

async function runTests() {
  console.log('1. Testing Backend Health...');
  await testEndpoint(`${BACKEND_URL}/api/health`);
  
  console.log('2. Testing Original Evaluator Endpoints...');
  await testEndpoint(`${BACKEND_URL}/api/evaluations/evaluator/profile`);
  await testEndpoint(`${BACKEND_URL}/api/evaluations/evaluator/evaluations`);
  await testEndpoint(`${BACKEND_URL}/api/evaluations/evaluator/teams`);
  
  console.log('3. Testing Admin Evaluator Endpoints (Current Issue)...');
  const profileResult = await testEndpoint(`${BACKEND_URL}/api/admin/evaluator/profile`);
  const evaluationsResult = await testEndpoint(`${BACKEND_URL}/api/admin/evaluator/evaluations`);
  const teamsResult = await testEndpoint(`${BACKEND_URL}/api/admin/evaluator/teams`);
  
  console.log('📋 ASSESSMENT SUMMARY:');
  console.log('======================');
  
  const has403 = [profileResult, evaluationsResult, teamsResult].some(r => r.status === 403);
  const has401 = [profileResult, evaluationsResult, teamsResult].some(r => r.status === 401);
  
  if (has403) {
    console.log('❌ ISSUE CONFIRMED: Evaluator endpoints returning 403 Forbidden');
    console.log('🔧 SOLUTION: Deploy updated backend with fixed middleware');
    console.log('📁 Files to deploy:');
    console.log('   - backend/src/routes/admin.routes.js');
    console.log('   - backend/src/middleware/auth.js');
  } else if (has401) {
    console.log('✅ ENDPOINTS WORKING: Evaluator endpoints properly protected');
    console.log('🎉 Frontend should work with proper authentication');
  } else {
    console.log('❓ UNEXPECTED STATUS: Check deployment and routing');
  }
  
  console.log('\n🚀 Next Steps:');
  if (has403) {
    console.log('1. Deploy the fixed backend code');
    console.log('2. Verify endpoints return 401 instead of 403');
    console.log('3. Test frontend with valid evaluator credentials');
  } else {
    console.log('1. Test frontend with valid evaluator login credentials');
    console.log('2. Check if user role is properly set during login');
    console.log('3. Verify token is being sent with API requests');
  }
}

runTests().catch(console.error);
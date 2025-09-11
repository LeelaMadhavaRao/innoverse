import axios from 'axios';

const API_BASE_URL = 'https://inno-backend-y1bv.onrender.com/api';

async function testBackendAPI() {
  console.log('🧪 Testing Backend API Endpoints...');
  console.log('===================================');

  try {
    // Test 1: Health Check
    console.log('\n1. Testing Health Endpoint...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/health`);
      console.log('✅ Health Check:', healthResponse.data);
    } catch (error) {
      console.error('❌ Health Check Failed:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      }
    }

    // Test 2: Teams Endpoint
    console.log('\n2. Testing Teams Endpoint...');
    try {
      const teamsResponse = await axios.get(`${API_BASE_URL}/teams`);
      console.log('✅ Teams Endpoint:', {
        success: teamsResponse.data.success,
        count: teamsResponse.data.count || teamsResponse.data.data?.length || 0,
        dataStructure: typeof teamsResponse.data.data
      });
      
      if (teamsResponse.data.data && teamsResponse.data.data.length > 0) {
        console.log('   Sample team:', {
          name: teamsResponse.data.data[0].teamName,
          leader: teamsResponse.data.data[0].teamLeader?.name,
          membersCount: teamsResponse.data.data[0].teamMembers?.length || 0
        });
      }
    } catch (error) {
      console.error('❌ Teams Endpoint Failed:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', error.response.data);
      }
    }

    // Test 3: CORS Check
    console.log('\n3. Testing CORS Configuration...');
    try {
      const corsResponse = await axios.options(`${API_BASE_URL}/teams`);
      console.log('✅ CORS Options:', corsResponse.status);
    } catch (error) {
      console.log('ℹ️ CORS Options not supported (normal for many APIs)');
    }

    // Test 4: Auth Endpoints (should fail without credentials)
    console.log('\n4. Testing Auth Endpoints (should return 401/400)...');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {});
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        console.log('✅ Auth endpoint responding correctly (validation error expected)');
      } else {
        console.error('❌ Auth endpoint error:', error.message);
      }
    }

  } catch (generalError) {
    console.error('💥 General test error:', generalError.message);
  }

  console.log('\n🎯 Test completed!');
}

// Run the test
testBackendAPI();

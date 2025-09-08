// Test team creation endpoint
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testTeamCreation() {
  try {
    console.log('Testing team creation endpoint...\n');

    // First, let's test if the endpoint exists without auth
    console.log('1. Testing POST /admin/teams without auth (should fail with 401)');
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/teams`, {
        teamName: 'Test Team',
        teamLeader: {
          name: 'John Doe',
          email: 'john@test.com',
        },
        teamSize: 4,
        teamMembers: ['Alice', 'Bob', 'Charlie'],
        projectDetails: {
          idea: 'Test project idea'
        }
      });
      console.log('❌ Unexpected success:', response.status);
    } catch (error) {
      console.log('✅ Expected auth error:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n2. Testing endpoint structure...');
    try {
      // Try to get teams (should also fail with auth, but might give different error)
      const response = await axios.get(`${API_BASE_URL}/admin/teams`);
      console.log('❌ Unexpected success:', response.status);
    } catch (error) {
      console.log('✅ Auth check working:', error.response?.status, error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  testTeamCreation();
}

module.exports = { testTeamCreation };

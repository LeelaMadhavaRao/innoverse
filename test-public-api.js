// Test script to verify public poster launch endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testPublicEndpoints() {
  try {
    console.log('Testing public poster launch endpoints...\n');

    // Test 1: Get public launched posters
    console.log('1. Testing GET /poster-launch/public/launched');
    try {
      const response = await axios.get(`${API_BASE_URL}/poster-launch/public/launched`);
      console.log('✅ Success:', response.status);
      console.log('Data:', response.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.data || error.message);
    }

    console.log('\n---\n');

    // Test 2: Increment poster view (if there are any posters)
    console.log('2. Testing PUT /poster-launch/public/launched/:posterId/view');
    try {
      // Using a test poster ID - this might fail if no posters exist
      const testPosterId = 'test-poster-id';
      const response = await axios.put(`${API_BASE_URL}/poster-launch/public/launched/${testPosterId}/view`);
      console.log('✅ Success:', response.status);
      console.log('Data:', response.data);
    } catch (error) {
      console.log('❌ Error (expected if no posters):', error.response?.status, error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPublicEndpoints();

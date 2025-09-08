const axios = require('axios');

// Test the reset API endpoint
async function testResetAPI() {
  try {
    // Login first to get token
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@innoverse.com',
      password: 'admin123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Check current launched posters
    console.log('\n📊 Checking current launched posters...');
    const currentPosters = await axios.get('http://localhost:5000/api/admin/poster-launch/launched', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Found ${currentPosters.data.length} launched posters`);

    if (currentPosters.data.length > 0) {
      console.log('Current posters:', currentPosters.data.map(p => ({ id: p.posterId, title: p.title })));
      
      // Test the bulk reset API
      console.log('\n🔄 Testing bulk reset API...');
      const resetResponse = await axios.delete('http://localhost:5000/api/admin/poster-launch/reset-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Bulk reset response:', resetResponse.data);
      
      // Check if posters were actually removed
      console.log('\n📊 Checking posters after reset...');
      const postersAfterReset = await axios.get('http://localhost:5000/api/admin/poster-launch/launched', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Found ${postersAfterReset.data.length} launched posters after reset`);
      
      if (postersAfterReset.data.length === 0) {
        console.log('🎉 SUCCESS: All posters were reset successfully!');
      } else {
        console.log('❌ FAIL: Some posters were not reset');
      }
    } else {
      console.log('ℹ️  No posters currently launched, testing with empty state...');
      
      // Test reset with no posters
      const resetResponse = await axios.delete('http://localhost:5000/api/admin/poster-launch/reset-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Reset response (empty state):', resetResponse.data);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testResetAPI();

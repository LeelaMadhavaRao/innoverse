// Debug: Test teams endpoint specifically
async function testTeamsEndpoint() {
  console.log('🔍 Testing teams endpoint...');
  
  const url = 'https://inno-backend-y1bv.onrender.com/api/teams';
  
  try {
    console.log(`\n📡 Testing: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    console.log(`🔧 Headers:`, [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`📄 Response:`, {
        success: data.success,
        count: data.count,
        hasData: Array.isArray(data.data),
        dataLength: data.data?.length || 0
      });
      
      if (data.data && data.data.length > 0) {
        console.log(`👥 First team:`, {
          teamName: data.data[0].teamName,
          teamLeader: data.data[0].teamLeader,
          memberCount: data.data[0].teamMembers?.length || 0
        });
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ Error response: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
    console.log(`❌ Error stack:`, error.stack);
  }
}

// Run the test
testTeamsEndpoint();

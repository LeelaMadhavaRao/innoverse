// Debug: Test with proper timeout and error handling
async function testWithTimeout(url, timeoutMs = 5000) {
  return new Promise(async (resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(timeoutMs)
      });
      
      clearTimeout(timeout);
      resolve(response);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

async function testEndpoints() {
  console.log('🔍 Testing endpoints with timeout...');
  
  // Test health endpoint first
  try {
    console.log('\n📡 Testing health endpoint...');
    const healthResponse = await testWithTimeout('https://inno-backend-y1bv.onrender.com/api/health', 5000);
    console.log(`✅ Health Status: ${healthResponse.status}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log(`✅ Health Response:`, healthData);
    }
  } catch (error) {
    console.log(`❌ Health Error: ${error.message}`);
    return; // Don't test teams if health fails
  }
  
  // Test teams endpoint
  try {
    console.log('\n📡 Testing teams endpoint...');
    const teamsResponse = await testWithTimeout('https://inno-backend-y1bv.onrender.com/api/teams', 10000);
    console.log(`✅ Teams Status: ${teamsResponse.status}`);
    
    if (teamsResponse.ok) {
      const teamsData = await teamsResponse.json();
      console.log(`✅ Teams Response:`, {
        success: teamsData.success,
        count: teamsData.count,
        hasData: Array.isArray(teamsData.data),
        timestamp: teamsData.timestamp
      });
    } else {
      const errorText = await teamsResponse.text();
      console.log(`❌ Teams Error Response: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Teams Error: ${error.message}`);
  }
}

// Run the test
testEndpoints();

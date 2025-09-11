// Debug: Test different URL variations
const testUrls = [
  'https://inno-backend-y1bv.onrender.com/api/health',
  'https://inno-backend-y1bv.onrender.com/health',
  'https://innoverse-backend.onrender.com/api/health',
  'https://innoverse-backend.onrender.com/health'
];

async function testEndpoints() {
  console.log('🔍 Testing different URL endpoints...');
  
  for (const url of testUrls) {
    try {
      console.log(`\n📡 Testing: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`✅ Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.text();
        console.log(`📄 Response: ${data.slice(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Run the test
testEndpoints();

// Debug admin APIs to see actual response structure
const debugAdminAPIs = async () => {
  try {
    console.log('🔍 Debug admin APIs...');
    
    // First login as admin
    const loginResponse = await fetch('https://inno-backend-y1bv.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@innoverse.com',
        password: 'admin123'
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ Admin login failed:', loginData.message);
      return;
    }
    
    console.log('✅ Admin login successful');
    const token = loginData.token;
    
    // Test each endpoint and log full response structure
    const endpoints = [
      { name: 'evaluations', url: '/api/admin/evaluations' },
      { name: 'evaluators', url: '/api/admin/evaluators' },
      { name: 'teams', url: '/api/admin/teams' }
    ];
    
    for (const endpoint of endpoints) {
      console.log(`\n🔍 Testing ${endpoint.name} endpoint...`);
      const response = await fetch(`https://inno-backend-y1bv.onrender.com${endpoint.url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${endpoint.name} response:`, {
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'Not an array',
          hasDataProperty: data.hasOwnProperty('data'),
          dataLength: data.data ? (Array.isArray(data.data) ? data.data.length : 'data is not array') : 'No data property',
          firstItemKeys: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : 'No items or not array',
          sampleData: Array.isArray(data) ? data.slice(0, 1) : 'First property keys: ' + (typeof data === 'object' ? Object.keys(data).slice(0, 5) : 'Not object')
        });
      } else {
        const errorData = await response.json();
        console.log(`❌ ${endpoint.name} failed:`, response.status, errorData.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
};

debugAdminAPIs();
// Test admin evaluations API
const testAdminEvaluations = async () => {
  try {
    console.log('🔍 Testing admin login...');
    
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
    console.log('- User:', loginData.user.name);
    console.log('- Role:', loginData.user.role);
    
    const token = loginData.token;
    
    // Test admin evaluations endpoint
    console.log('\n🔍 Testing admin evaluations endpoint...');
    const evaluationsResponse = await fetch('https://inno-backend-y1bv.onrender.com/api/admin/evaluations', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (evaluationsResponse.ok) {
      const evaluationsData = await evaluationsResponse.json();
      console.log('✅ Admin evaluations endpoint working!');
      console.log('- Teams count:', Array.isArray(evaluationsData) ? evaluationsData.length : 0);
    } else {
      const errorData = await evaluationsResponse.json();
      console.log('❌ Admin evaluations failed:', evaluationsResponse.status);
      console.log('- Error:', errorData.message);
    }
    
    // Test admin evaluators endpoint
    console.log('\n🔍 Testing admin evaluators endpoint...');
    const evaluatorsResponse = await fetch('https://inno-backend-y1bv.onrender.com/api/admin/evaluators', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (evaluatorsResponse.ok) {
      const evaluatorsData = await evaluatorsResponse.json();
      console.log('✅ Admin evaluators endpoint working!');
      console.log('- Evaluators count:', Array.isArray(evaluatorsData) ? evaluatorsData.length : 0);
    } else {
      const errorData = await evaluatorsResponse.json();
      console.log('❌ Admin evaluators failed:', evaluatorsResponse.status);
      console.log('- Error:', errorData.message);
    }
    
    // Test admin teams endpoint
    console.log('\n🔍 Testing admin teams endpoint...');
    const teamsResponse = await fetch('https://inno-backend-y1bv.onrender.com/api/admin/teams', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (teamsResponse.ok) {
      const teamsData = await teamsResponse.json();
      console.log('✅ Admin teams endpoint working!');
      console.log('- Teams count:', Array.isArray(teamsData) ? teamsData.length : 0);
    } else {
      const errorData = await teamsResponse.json();
      console.log('❌ Admin teams failed:', teamsResponse.status);
      console.log('- Error:', errorData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAdminEvaluations();
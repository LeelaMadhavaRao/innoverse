// Test evaluator login
const testLogin = async () => {
  try {
    const response = await fetch('https://inno-backend-y1bv.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'leelamadhav.nulakani@gmail.com',
        password: 'evaluator123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('- Token:', data.token ? 'Received' : 'Missing');
      console.log('- User:', data.user.name);
      console.log('- Role:', data.user.role);
      console.log('- Email:', data.user.email);
      
      // Test evaluator teams endpoint
      console.log('\n🔍 Testing evaluator teams endpoint...');
      const teamsResponse = await fetch('https://inno-backend-y1bv.onrender.com/api/admin/evaluator/teams', {
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        console.log('✅ Teams endpoint working!');
        console.log('- Evaluator:', teamsData.evaluator?.name || 'N/A');
        console.log('- Teams count:', teamsData.teams?.length || 0);
      } else {
        const errorData = await teamsResponse.json();
        console.log('❌ Teams endpoint failed:', teamsResponse.status);
        console.log('- Error:', errorData.message);
      }
      
    } else {
      console.log('❌ Login failed:', response.status);
      console.log('- Error:', data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testLogin();
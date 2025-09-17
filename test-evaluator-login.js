// Test script to verify evaluator login and API access
const API_BASE = 'https://inno-backend-y1bv.onrender.com/api';

async function testEvaluatorLogin() {
  console.log('🚀 Testing Evaluator Login and API Access...\n');

  try {
    // Step 1: Login as evaluator
    console.log('1. Attempting evaluator login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'leelamadhav.nulakani@gmail.com',
        password: 'evaluator123'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', loginResponse.status, error);
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('👤 User:', loginData.user.name, '- Role:', loginData.user.role);
    
    const token = loginData.token;

    // Step 2: Test evaluator teams endpoint
    console.log('\n2. Testing evaluator teams endpoint...');
    const teamsResponse = await fetch(`${API_BASE}/admin/evaluator/teams`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!teamsResponse.ok) {
      const error = await teamsResponse.text();
      console.log('❌ Teams endpoint failed:', teamsResponse.status, error);
    } else {
      const teamsData = await teamsResponse.json();
      console.log('✅ Teams endpoint successful!');
      console.log('📊 Teams available:', teamsData.teams?.length || 0);
      console.log('👨‍🏫 Evaluator:', teamsData.evaluator?.name);
      console.log('📈 Completion:', teamsData.evaluator?.completed, '/', teamsData.evaluator?.totalAvailable);
    }

    // Step 3: Test evaluator profile endpoint
    console.log('\n3. Testing evaluator profile endpoint...');
    const profileResponse = await fetch(`${API_BASE}/admin/evaluator/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      const error = await profileResponse.text();
      console.log('❌ Profile endpoint failed:', profileResponse.status, error);
    } else {
      const profileData = await profileResponse.json();
      console.log('✅ Profile endpoint successful!');
      console.log('👤 Profile:', profileData.profile?.name);
      console.log('📧 Email:', profileData.profile?.email);
    }

    // Step 4: Test evaluator evaluations endpoint
    console.log('\n4. Testing evaluator evaluations endpoint...');
    const evaluationsResponse = await fetch(`${API_BASE}/admin/evaluator/evaluations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!evaluationsResponse.ok) {
      const error = await evaluationsResponse.text();
      console.log('❌ Evaluations endpoint failed:', evaluationsResponse.status, error);
    } else {
      const evaluationsData = await evaluationsResponse.json();
      console.log('✅ Evaluations endpoint successful!');
      console.log('📝 Completed evaluations:', evaluationsData.evaluations?.length || 0);
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

// Run the test
testEvaluatorLogin();
// Reset evaluator password script
const API_BASE = 'https://inno-backend-y1bv.onrender.com/api';

async function resetEvaluatorPassword() {
  console.log('🔧 Resetting Evaluator Password...\n');

  try {
    // Login as admin
    console.log('1. Logging in as admin...');
    const adminLoginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@innoverse.com',
        password: 'admin123'
      })
    });

    if (!adminLoginResponse.ok) {
      console.log('❌ Admin login failed');
      return;
    }

    const adminData = await adminLoginResponse.json();
    console.log('✅ Admin logged in successfully');

    // Get all evaluators to find the one with the email
    console.log('\n2. Finding evaluator account...');
    const evaluatorsResponse = await fetch(`${API_BASE}/admin/evaluators`, {
      headers: { 'Authorization': `Bearer ${adminData.token}` }
    });

    if (!evaluatorsResponse.ok) {
      console.log('❌ Failed to get evaluators');
      return;
    }

    const evaluators = await evaluatorsResponse.json();
    console.log('📋 Found', evaluators.data?.length || 0, 'evaluators');

    const targetEvaluator = evaluators.data?.find(
      evaluator => evaluator.email === 'leelamadhav.nulakani@gmail.com'
    );

    if (!targetEvaluator) {
      console.log('❌ Evaluator not found with email: leelamadhav.nulakani@gmail.com');
      
      // List all evaluators
      console.log('\n📋 Available evaluators:');
      evaluators.data?.forEach(evaluator => {
        console.log('  -', evaluator.name, '(', evaluator.email, ')');
      });
      return;
    }

    console.log('✅ Found evaluator:', targetEvaluator.name, '-', targetEvaluator.email);

    // Update the evaluator password
    console.log('\n3. Updating evaluator password...');
    const updateResponse = await fetch(`${API_BASE}/admin/evaluators/${targetEvaluator._id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${adminData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: 'evaluator123',
        name: targetEvaluator.name,
        email: targetEvaluator.email,
        organization: targetEvaluator.organization
      })
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      console.log('❌ Failed to update password:', error);
      return;
    }

    console.log('✅ Password updated successfully!');

    // Test the new credentials
    console.log('\n4. Testing new credentials...');
    const testLoginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'leelamadhav.nulakani@gmail.com',
        password: 'evaluator123'
      })
    });

    if (testLoginResponse.ok) {
      const testData = await testLoginResponse.json();
      console.log('✅ New credentials work!');
      console.log('👤 User:', testData.user.name, '- Role:', testData.user.role);
      
      // Test teams endpoint
      const teamsResponse = await fetch(`${API_BASE}/admin/evaluator/teams`, {
        headers: { 'Authorization': `Bearer ${testData.token}` }
      });
      
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        console.log('✅ Teams endpoint working!');
        console.log('📊 Teams available:', teamsData.teams?.length || 0);
        console.log('👨‍🏫 Evaluator name:', teamsData.evaluator?.name);
      } else {
        const error = await teamsResponse.text();
        console.log('❌ Teams endpoint failed:', error);
      }
    } else {
      const error = await testLoginResponse.text();
      console.log('❌ New credentials failed:', error);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

resetEvaluatorPassword();
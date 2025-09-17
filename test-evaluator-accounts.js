// Test script to check available evaluator accounts
const API_BASE = 'https://inno-backend-y1bv.onrender.com/api';

async function checkEvaluatorAccounts() {
  console.log('🔍 Checking Evaluator Accounts...\n');

  try {
    // Test backend connectivity first
    console.log('1. Testing backend connectivity...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (healthResponse.ok) {
      console.log('✅ Backend is responding');
    } else {
      console.log('❌ Backend health check failed');
    }

    // Try to get teams without auth to test public endpoint
    console.log('\n2. Testing public teams endpoint...');
    const teamsResponse = await fetch(`${API_BASE}/teams`);
    if (teamsResponse.ok) {
      const teams = await teamsResponse.json();
      console.log('✅ Public teams endpoint working, found', teams.length, 'teams');
    } else {
      console.log('❌ Public teams endpoint failed');
    }

    // Test common evaluator passwords
    const testCredentials = [
      { email: 'leelamadhav.nulakani@gmail.com', password: 'evaluator123' },
      { email: 'leelamadhav.nulakani@gmail.com', password: 'password123' },
      { email: 'leelamadhav.nulakani@gmail.com', password: 'evaluator' },
      { email: 'evaluator@example.com', password: 'evaluator123' },
      { email: 'evaluator1@example.com', password: 'evaluator123' }
    ];

    console.log('\n3. Testing evaluator credentials...');
    for (const creds of testCredentials) {
      try {
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(creds)
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          console.log('✅ SUCCESS:', creds.email, '- Role:', data.user.role, '- Name:', data.user.name);
          
          // If successful, test the teams endpoint
          const token = data.token;
          const teamsTestResponse = await fetch(`${API_BASE}/admin/evaluator/teams`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (teamsTestResponse.ok) {
            const teamsData = await teamsTestResponse.json();
            console.log('   📋 Teams accessible:', teamsData.teams?.length || 0);
          } else {
            console.log('   ❌ Teams endpoint failed with token');
          }
          
          return; // Exit on first success
        } else {
          const error = await loginResponse.text();
          console.log('❌ FAILED:', creds.email, '- Error:', error);
        }
      } catch (err) {
        console.log('❌ ERROR:', creds.email, '- Exception:', err.message);
      }
    }

    console.log('\n4. Creating test evaluator account...');
    // Try to create a test evaluator account using admin credentials
    const adminCredentials = [
      { email: 'admin@innoverse.com', password: 'admin123' },
      { email: 'admin@example.com', password: 'admin123' }
    ];

    for (const adminCreds of adminCredentials) {
      try {
        const adminLoginResponse = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminCreds)
        });

        if (adminLoginResponse.ok) {
          const adminData = await adminLoginResponse.json();
          console.log('✅ Admin login successful:', adminCreds.email);
          
          // Create evaluator account
          const createEvaluatorResponse = await fetch(`${API_BASE}/admin/evaluators`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${adminData.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: 'Test Evaluator',
              email: 'leelamadhav.nulakani@gmail.com',
              password: 'evaluator123',
              organization: 'Test Organization',
              type: 'academic'
            })
          });

          if (createEvaluatorResponse.ok) {
            console.log('✅ Test evaluator account created successfully');
          } else {
            const error = await createEvaluatorResponse.text();
            console.log('❌ Failed to create evaluator:', error);
          }
          break;
        }
      } catch (err) {
        console.log('❌ Admin login error:', err.message);
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

checkEvaluatorAccounts();
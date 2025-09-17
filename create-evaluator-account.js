// Create evaluator account script
const API_BASE = 'https://inno-backend-y1bv.onrender.com/api';

async function createEvaluatorAccount() {
  console.log('🔧 Creating Evaluator Account...\n');

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

    // Check existing evaluators
    console.log('\n2. Checking existing evaluators...');
    const evaluatorsResponse = await fetch(`${API_BASE}/admin/evaluators`, {
      headers: { 'Authorization': `Bearer ${adminData.token}` }
    });

    if (evaluatorsResponse.ok) {
      const evaluators = await evaluatorsResponse.json();
      console.log('📋 Existing evaluators:', evaluators.data?.length || 0);
      
      if (evaluators.data && evaluators.data.length > 0) {
        console.log('📋 Current evaluators:');
        evaluators.data.forEach(evaluator => {
          console.log('  -', evaluator.name, '(', evaluator.email, ')');
        });
      }
    }

    // Create new evaluator account
    console.log('\n3. Creating evaluator account...');
    const createResponse = await fetch(`${API_BASE}/admin/evaluators`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Leela Madhav Rao',
        email: 'leelamadhav.nulakani@gmail.com',
        password: 'evaluator123',
        organization: 'SRKR Engineering College',
        designation: 'Faculty Evaluator',
        type: 'academic',
        expertise: ['Software Engineering', 'Innovation'],
        experience: '5+ years',
        phone: '+91-9876543210'
      })
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.log('❌ Failed to create evaluator:', error);
      
      // If it already exists, let's try to find it by checking users
      console.log('\n4. Checking if user exists...');
      const usersResponse = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${adminData.token}` }
      });
      
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        const existingUser = users.data?.find(user => user.email === 'leelamadhav.nulakani@gmail.com');
        if (existingUser) {
          console.log('✅ User exists:', existingUser.name, '- Role:', existingUser.role);
          console.log('📧 Email:', existingUser.email);
          
          // Test login with this user
          console.log('\n5. Testing login...');
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
            console.log('✅ Login successful!');
            console.log('👤 User:', testData.user.name, '- Role:', testData.user.role);
          } else {
            const loginError = await testLoginResponse.text();
            console.log('❌ Login failed:', loginError);
          }
        }
      }
      return;
    }

    const newEvaluator = await createResponse.json();
    console.log('✅ Evaluator account created successfully!');
    console.log('📧 Email:', newEvaluator.email);
    console.log('👤 Name:', newEvaluator.name);

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
      console.log('✅ Login successful!');
      console.log('👤 User:', testData.user.name, '- Role:', testData.user.role);
      
      // Test teams endpoint
      console.log('\n5. Testing teams endpoint...');
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
      console.log('❌ Login failed:', error);
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createEvaluatorAccount();
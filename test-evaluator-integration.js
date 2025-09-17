/**
 * Comprehensive Evaluator Integration Test
 * Tests all evaluator endpoints and frontend-backend integration
 */

const BACKEND_URL = 'https://inno-backend-y1bv.onrender.com';
const FRONTEND_URL = 'https://innoverse-csit.web.app'; // Update with actual frontend URL

console.log('🔧 Testing Evaluator Integration...\n');

// Test 1: Backend Health Check
console.log('1. Testing Backend Health...');
fetch(`${BACKEND_URL}/api/health`)
  .then(res => res.json())
  .then(data => {
    console.log('   ✅ Backend Health:', data.success ? 'OK' : 'FAILED');
    console.log('   📊 Environment:', data.environment);
    console.log('   ⏰ Timestamp:', data.timestamp);
  })
  .catch(err => console.log('   ❌ Backend Health: FAILED -', err.message));

// Test 2: Admin Evaluator Endpoints (Protected - should return 401)
console.log('\n2. Testing Admin Evaluator Endpoints (Protected)...');

const testEndpoints = [
  '/api/admin/evaluator/profile',
  '/api/admin/evaluator/evaluations',
  '/api/admin/evaluator/teams'
];

testEndpoints.forEach(endpoint => {
  fetch(`${BACKEND_URL}${endpoint}`)
    .then(res => {
      console.log(`   ${res.status === 401 ? '✅' : '❌'} ${endpoint}: ${res.status} ${res.statusText}`);
      if (res.status !== 401) {
        console.log('   ⚠️  Expected 401 Unauthorized for protected endpoint');
      }
    })
    .catch(err => console.log(`   ❌ ${endpoint}: FAILED -`, err.message));
});

// Test 3: Frontend Accessibility
console.log('\n3. Testing Frontend Accessibility...');
fetch(FRONTEND_URL)
  .then(res => {
    console.log(`   ${res.ok ? '✅' : '❌'} Frontend: ${res.status} ${res.statusText}`);
    return res.text();
  })
  .then(html => {
    if (html.includes('Innoverse') || html.includes('Innovation')) {
      console.log('   ✅ Frontend content loaded successfully');
    } else {
      console.log('   ⚠️  Frontend loaded but content might be missing');
    }
  })
  .catch(err => console.log('   ❌ Frontend: FAILED -', err.message));

// Test 4: Login Endpoint
console.log('\n4. Testing Login Endpoint...');
fetch(`${BACKEND_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123',
    role: 'evaluator'
  })
})
  .then(res => {
    console.log(`   ${res.status === 400 || res.status === 401 ? '✅' : '❌'} Login endpoint: ${res.status} ${res.statusText}`);
    if (res.status === 400 || res.status === 401) {
      console.log('   ✅ Login endpoint properly validates credentials');
    }
    return res.json();
  })
  .then(data => {
    if (data.message) {
      console.log('   📝 Response:', data.message);
    }
  })
  .catch(err => console.log('   ❌ Login endpoint: FAILED -', err.message));

// Test 5: CORS Configuration
console.log('\n5. Testing CORS Configuration...');
fetch(`${BACKEND_URL}/api/health`, {
  headers: {
    'Origin': FRONTEND_URL
  }
})
  .then(res => {
    const corsHeader = res.headers.get('Access-Control-Allow-Origin');
    console.log(`   ${corsHeader ? '✅' : '❌'} CORS headers: ${corsHeader || 'MISSING'}`);
  })
  .catch(err => console.log('   ❌ CORS test: FAILED -', err.message));

setTimeout(() => {
  console.log('\n🏁 Integration test completed!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Deploy latest backend code with evaluator routes');
  console.log('   2. Test actual evaluator login with valid credentials');
  console.log('   3. Verify profile and evaluations pages work correctly');
  console.log('   4. Check navigation menu shows "Profile" instead of "Teams"');
}, 2000);
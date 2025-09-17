/**
 * Frontend Authentication Debug Test
 * Checks authentication status and token validity
 */

console.log('🔐 Checking Frontend Authentication Status...\n');

// Check localStorage for authentication data
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('📋 Authentication Status:');
console.log('========================');

if (token) {
  console.log('✅ Token found in localStorage');
  console.log(`📝 Token preview: ${token.substring(0, 20)}...`);
  
  // Try to decode JWT token (basic decode, not verification)
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const tokenData = JSON.parse(jsonPayload);
    console.log('🔍 Token contents:');
    console.log(`   User ID: ${tokenData.id}`);
    console.log(`   Issued: ${new Date(tokenData.iat * 1000).toLocaleString()}`);
    console.log(`   Expires: ${new Date(tokenData.exp * 1000).toLocaleString()}`);
    
    const now = Math.floor(Date.now() / 1000);
    if (tokenData.exp < now) {
      console.log('❌ Token is EXPIRED');
    } else {
      console.log('✅ Token is still valid');
    }
  } catch (e) {
    console.log('❌ Failed to decode token:', e.message);
  }
} else {
  console.log('❌ No token found in localStorage');
}

if (user) {
  console.log('✅ User data found in localStorage');
  try {
    const userData = JSON.parse(user);
    console.log('👤 User details:');
    console.log(`   Name: ${userData.name}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Role: ${userData.role}`);
    
    if (userData.role !== 'evaluator') {
      console.log('❌ User role is NOT evaluator');
    } else {
      console.log('✅ User role is evaluator');
    }
  } catch (e) {
    console.log('❌ Failed to parse user data:', e.message);
  }
} else {
  console.log('❌ No user data found in localStorage');
}

// Test API call with current authentication
console.log('\n🧪 Testing API Call with Current Auth...');
const API_BASE_URL = 'https://inno-backend-y1bv.onrender.com/api';

if (token) {
  fetch(`${API_BASE_URL}/admin/evaluator/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log(`📡 API Response: ${response.status} ${response.statusText}`);
    if (response.status === 200) {
      console.log('✅ API call successful');
      return response.json();
    } else if (response.status === 401) {
      console.log('❌ Token invalid or expired');
    } else if (response.status === 403) {
      console.log('❌ Permission denied (wrong role)');
    } else {
      console.log(`❓ Unexpected status: ${response.status}`);
    }
    return response.text();
  })
  .then(data => {
    console.log('📊 Response data:', data);
  })
  .catch(error => {
    console.log('❌ API call failed:', error.message);
  });
} else {
  console.log('❌ Cannot test API - no token available');
}

console.log('\n🔧 Recommended Actions:');
if (!token || !user) {
  console.log('1. Login again with evaluator credentials');
  console.log('2. Ensure role is set to "evaluator" during login');
} else {
  console.log('1. Check if token is expired (see above)');
  console.log('2. Try logging out and logging back in');
  console.log('3. Verify evaluator account exists in backend');
}
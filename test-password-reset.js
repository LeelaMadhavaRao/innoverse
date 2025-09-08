// Test the password reset
// Run this in your terminal after starting the backend server

const testPasswordReset = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/emergency-password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'YOUR_TEAM_LEADER_EMAIL@example.com', // Replace with actual email
        newPassword: 'NewTempPass123!'
      })
    });
    
    const result = await response.json();
    console.log('Password Reset Result:', result);
    
    if (result.success) {
      console.log('\n✅ Password reset successful!');
      console.log('👤 Email: YOUR_TEAM_LEADER_EMAIL@example.com');
      console.log('🔐 New Password: NewTempPass123!');
      console.log('\nNow try logging in with these credentials.');
    } else {
      console.log('\n❌ Password reset failed:', result.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Uncomment the line below to run the test
// testPasswordReset();

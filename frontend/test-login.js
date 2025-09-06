// Simple test to check frontend API connectivity
const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@innoverse.com',
        password: 'admin123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful:', data);
      return data;
    } else {
      const error = await response.text();
      console.error('❌ Login failed:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
};

// Run the test
testLogin();

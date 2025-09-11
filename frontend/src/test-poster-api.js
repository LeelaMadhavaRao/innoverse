// Test script for poster launch APIs
import { fetch } from 'undici';

const API_BASE = 'https://inno-backend-y1bv.onrender.com';

async function testAPI() {
  try {
    console.log('🧪 Testing Launched Posters API...');
    
    // Test public launched posters endpoint
    const response = await fetch(`${API_BASE}/api/poster-launch/public/launched`);
    const data = await response.json();
    
    console.log('📊 Public Launched Posters Response:', {
      success: data.success,
      count: data.count,
      posters: data.data?.map(p => ({
        id: p.posterId,
        title: p.title,
        views: p.analytics?.views || 0
      }))
    });

    // Test view increment if posters exist
    if (data.data && data.data.length > 0) {
      const firstPoster = data.data[0];
      console.log(`📈 Testing view increment for: ${firstPoster.title}`);
      
      const viewResponse = await fetch(`${API_BASE}/api/poster-launch/public/launched/${firstPoster.posterId}/view`, {
        method: 'PUT'
      });
      
      const viewResult = await viewResponse.json();
      console.log('🔢 View increment result:', viewResult);
    }

  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
}

// Run test
testAPI();

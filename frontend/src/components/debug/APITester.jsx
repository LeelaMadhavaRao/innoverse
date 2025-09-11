import React, { useState } from 'react';
import { Button } from '../ui/button';

const APITester = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (url, name) => {
    try {
      const startTime = Date.now();
      const response = await fetch(url);
      const endTime = Date.now();
      const data = await response.json();
      
      return {
        name,
        url,
        status: response.status,
        success: response.ok,
        data: data,
        responseTime: endTime - startTime,
        error: null
      };
    } catch (error) {
      return {
        name,
        url,
        status: 'ERROR',
        success: false,
        data: null,
        responseTime: 0,
        error: error.message
      };
    }
  };

  const runTests = async () => {
    setLoading(true);
    setResults([]);

    const baseURL = 'https://inno-backend-y1bv.onrender.com/api';
    
    const tests = [
      { url: `${baseURL}/health`, name: 'Health Check' },
      { url: `${baseURL}/teams`, name: 'Teams Endpoint' },
      { url: `${baseURL}`, name: 'Root API' },
      { url: 'https://inno-backend-y1bv.onrender.com', name: 'Root Domain' }
    ];

    const testResults = [];
    
    for (const test of tests) {
      console.log(`Testing ${test.name}: ${test.url}`);
      const result = await testEndpoint(test.url, test.name);
      testResults.push(result);
      setResults([...testResults]);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">API Connectivity Test</h3>
      
      <Button 
        onClick={runTests} 
        disabled={loading}
        className="mb-4 bg-blue-600 hover:bg-blue-700"
      >
        {loading ? 'Testing...' : 'Test API Endpoints'}
      </Button>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`p-3 rounded border-l-4 ${
              result.success 
                ? 'bg-green-900/20 border-green-500 text-green-300' 
                : 'bg-red-900/20 border-red-500 text-red-300'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{result.name}</span>
              <div className="flex gap-2 text-sm">
                <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                  {result.status}
                </span>
                {result.responseTime > 0 && (
                  <span className="text-gray-400">{result.responseTime}ms</span>
                )}
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mb-1">{result.url}</div>
            
            {result.error && (
              <div className="text-red-400 text-sm">Error: {result.error}</div>
            )}
            
            {result.success && result.data && (
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-300 hover:text-white">
                  Response Data
                </summary>
                <pre className="mt-2 p-2 bg-gray-900 rounded text-gray-300 overflow-auto max-h-32">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default APITester;

import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import cloudimageService from '../../services/cloudimage';
import OptimizedImage from './optimized-image';

/**
 * Component to test Cloudimage connection and show results
 */
const CloudimageTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTest, setShowTest] = useState(false);

  const runConnectionTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await cloudimageService.testConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed with error',
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run test on component mount if Cloudimage is configured
  useEffect(() => {
    if (cloudimageService.isAvailable()) {
      runConnectionTest();
    }
  }, []);

  if (!showTest && import.meta.env.MODE !== 'development') {
    return null;
  }

  const status = cloudimageService.getStatus();

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-md">
      <Card className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 p-4 text-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium flex items-center">
            <span className="text-lg mr-2">🧪</span>
            Cloudimage Test
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTest(!showTest)}
            className="text-xs border-gray-600 text-gray-400"
          >
            {showTest ? '−' : '+'}
          </Button>
        </div>

        {showTest && (
          <div className="space-y-3">
            {/* Configuration Status */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <Badge variant={status.configured ? 'default' : 'destructive'} className="text-xs">
                  {status.configured ? 'Configured' : 'Not Configured'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Token:</span>
                <Badge variant={status.token ? 'default' : 'destructive'} className="text-xs">
                  {status.token ? 'Set' : 'Missing'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Base URL:</span>
                <Badge variant={status.baseUrl ? 'default' : 'destructive'} className="text-xs">
                  {status.baseUrl ? 'Set' : 'Missing'}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Direct Upload:</span>
                <Badge variant="secondary" className="text-xs">
                  Disabled
                </Badge>
              </div>
            </div>

            {/* Connection Test */}
            <div className="border-t border-gray-700 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Connection Test:</span>
                <Button
                  size="sm"
                  onClick={runConnectionTest}
                  disabled={isLoading || !status.configured}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                >
                  {isLoading ? '⏳' : '🔄'} Test
                </Button>
              </div>

              {/* Test Results */}
              {testResult && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        testResult.success ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className={`text-xs ${
                      testResult.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResult.message}
                    </span>
                  </div>

                  {testResult.success && testResult.testUrl && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-xs mb-2">Test Image (300x200):</p>
                      <OptimizedImage
                        src="sample.li/bag_demo.jpg"
                        alt="Cloudimage test"
                        size="thumbnail"
                        className="w-20 h-14 rounded border border-gray-600"
                      />
                      <p className="text-xs text-gray-500 mt-1 break-all">
                        {testResult.testUrl}
                      </p>
                    </div>
                  )}

                  {!testResult.success && testResult.testUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 break-all">
                        Attempted URL: {testResult.testUrl}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sample URLs */}
            {status.configured && (
              <div className="border-t border-gray-700 pt-3">
                <p className="text-gray-400 text-xs mb-2">Sample Optimizations:</p>
                <div className="space-y-1 text-xs">
                  <div className="text-gray-500">
                    Original: sample.li/bag_demo.jpg
                  </div>
                  <div className="text-purple-400 break-all">
                    Optimized: {cloudimageService.getOptimizedUrl('sample.li/bag_demo.jpg', { width: 300, height: 200 })}
                  </div>
                </div>
              </div>
            )}

            {!status.configured && (
              <div className="border-t border-gray-700 pt-3">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2">
                  <p className="text-yellow-400 text-xs">
                    ⚠️ Add VITE_CLOUDIMAGE_TOKEN and VITE_CLOUDIMAGE_BASE_URL to your .env file
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CloudimageTest;

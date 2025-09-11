import React, { useState, useEffect } from 'react';
import { Badge } from './badge';
import cloudimageService from '../../services/cloudimage';

/**
 * Component to display Cloudimage status and configuration
 * Only visible in development mode
 */
const CloudimageStatus = () => {
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (import.meta.env.MODE === 'development') {
      setStatus(cloudimageService.getStatus());
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status?.configured ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-white font-medium">Cloudimage Status</span>
        </div>
        
        <div className="space-y-1 text-gray-400">
          <div className="flex justify-between">
            <span>Configured:</span>
            <Badge variant={status?.configured ? 'success' : 'destructive'} className="text-xs">
              {status?.configured ? 'Yes' : 'No'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span>Token:</span>
            <Badge variant={status?.token ? 'success' : 'destructive'} className="text-xs">
              {status?.token ? 'Set' : 'Missing'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span>Base URL:</span>
            <Badge variant={status?.baseUrl ? 'success' : 'destructive'} className="text-xs">
              {status?.baseUrl ? 'Set' : 'Missing'}
            </Badge>
          </div>
          
          <div className="flex justify-between">
            <span>API Key:</span>
            <Badge variant={status?.apiKey ? 'success' : 'warning'} className="text-xs">
              {status?.apiKey ? 'Set' : 'Optional'}
            </Badge>
          </div>
          
          {status?.folder && (
            <div className="flex justify-between">
              <span>Folder:</span>
              <span className="text-purple-400">{status.folder}</span>
            </div>
          )}
        </div>
        
        {!status?.configured && (
          <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400">
            <div className="font-medium">Setup Required:</div>
            <div className="text-xs mt-1">
              Add VITE_CLOUDIMAGE_TOKEN and VITE_CLOUDIMAGE_BASE_URL to your .env file
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudimageStatus;

import { useState, useEffect, useMemo } from 'react';
import cloudimageService from '../services/cloudimage';

/**
 * Custom hook for Cloudimage integration
 * @param {string} imageUrl - Original image URL
 * @param {Object} options - Cloudimage options
 * @returns {Object} - Optimized URLs and utilities
 */
export const useCloudimage = (imageUrl, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate optimized URLs
  const optimizedUrl = useMemo(() => {
    if (!imageUrl) return '/placeholder.jpg';
    return cloudimageService.getOptimizedUrl(imageUrl, options);
  }, [imageUrl, options]);

  const responsiveUrls = useMemo(() => {
    if (!imageUrl) return {};
    return cloudimageService.getResponsiveUrls(imageUrl);
  }, [imageUrl]);

  const srcSet = useMemo(() => {
    if (!imageUrl) return '';
    return cloudimageService.generateSrcSet(imageUrl, options.widths);
  }, [imageUrl, options.widths]);

  // Handle image loading
  useEffect(() => {
    if (!optimizedUrl) return;

    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setError(null);
    };
    img.onerror = () => {
      setIsLoading(false);
      setError('Failed to load image');
    };
    img.src = optimizedUrl;
  }, [optimizedUrl]);

  return {
    optimizedUrl,
    responsiveUrls,
    srcSet,
    isLoading,
    error,
    isCloudimageEnabled: cloudimageService.isAvailable()
  };
};

/**
 * Hook for gallery-specific image optimization
 * @param {string} imageUrl - Original image URL
 * @param {string} size - Size preset
 * @returns {Object} - Gallery optimized URLs
 */
export const useGalleryImage = (imageUrl, size = 'card') => {
  const galleryUrl = useMemo(() => {
    if (!imageUrl) return '/placeholder.jpg';
    return cloudimageService.getGalleryUrl(imageUrl, size);
  }, [imageUrl, size]);

  const allSizes = useMemo(() => {
    if (!imageUrl) return {};
    return {
      thumbnail: cloudimageService.getGalleryUrl(imageUrl, 'thumbnail'),
      card: cloudimageService.getGalleryUrl(imageUrl, 'card'),
      modal: cloudimageService.getGalleryUrl(imageUrl, 'modal'),
      fullscreen: cloudimageService.getGalleryUrl(imageUrl, 'fullscreen'),
      hero: cloudimageService.getGalleryUrl(imageUrl, 'hero')
    };
  }, [imageUrl]);

  return {
    galleryUrl,
    allSizes,
    isCloudimageEnabled: cloudimageService.isAvailable()
  };
};

/**
 * Hook for image upload with Cloudimage
 * @returns {Object} - Upload utilities
 */
export const useCloudimageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const uploadToCloudimage = async (file, options = {}) => {
    if (!cloudimageService.isAvailable()) {
      throw new Error('Cloudimage not configured');
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await cloudimageService.uploadImage(file, options);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      
      return result;
    } catch (error) {
      setIsUploading(false);
      setUploadError(error.message);
      throw error;
    }
  };

  const resetUpload = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setUploadError(null);
  };

  return {
    uploadToCloudimage,
    isUploading,
    uploadProgress,
    uploadError,
    resetUpload,
    isCloudimageEnabled: cloudimageService.isAvailable()
  };
};

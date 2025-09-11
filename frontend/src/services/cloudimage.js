/**
 * Cloudimage Integration Service
 * Handles image optimization, resizing, and CDN delivery
 */

class CloudimageService {
  constructor() {
    this.token = import.meta.env.VITE_CLOUDIMAGE_TOKEN;
    this.baseUrl = import.meta.env.VITE_CLOUDIMAGE_BASE_URL;
    this.folder = import.meta.env.VITE_CLOUDIMAGE_FOLDER || 'gallery';
    
    // Check if Cloudimage is properly configured
    this.isConfigured = this.token && this.baseUrl;
    
    if (!this.isConfigured) {
      console.warn('Cloudimage not configured. Using original URLs.');
    } else {
      console.log('✅ Cloudimage configured successfully:', {
        token: this.token,
        baseUrl: this.baseUrl,
        folder: this.folder
      });
    }
  }

  /**
   * Generate optimized image URL with Cloudimage
   * @param {string} imageUrl - Original image URL
   * @param {Object} options - Transformation options
   * @returns {string} - Optimized image URL
   */
  getOptimizedUrl(imageUrl, options = {}) {
    if (!this.isConfigured || !imageUrl) {
      return imageUrl || '/placeholder.jpg';
    }

    // If it's already a Cloudimage URL, return as is
    if (imageUrl.includes('cloudimg.io')) {
      return imageUrl;
    }

    // Default options
    const defaultOptions = {
      width: 600,
      height: 400,
      format: 'auto',
      quality: 85,
      progressive: true
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (finalOptions.width) params.append('w', finalOptions.width);
    if (finalOptions.height) params.append('h', finalOptions.height);
    if (finalOptions.format) params.append('f', finalOptions.format);
    if (finalOptions.quality) params.append('q', finalOptions.quality);
    if (finalOptions.progressive) params.append('progressive', 'true');
    if (finalOptions.blur) params.append('blur', finalOptions.blur);
    if (finalOptions.sharpen) params.append('sharpen', finalOptions.sharpen);
    if (finalOptions.brightness) params.append('brightness', finalOptions.brightness);
    if (finalOptions.contrast) params.append('contrast', finalOptions.contrast);
    if (finalOptions.saturation) params.append('saturation', finalOptions.saturation);
    
    // Handle crop/resize modes
    if (finalOptions.crop) params.append('crop', finalOptions.crop);
    if (finalOptions.gravity) params.append('gravity', finalOptions.gravity);
    
    // Clean the image URL (remove leading slash if present)
    const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    
    // Build the final URL
    const queryString = params.toString();
    return `${this.baseUrl}/v7/${cleanImageUrl}${queryString ? '?' + queryString : ''}`;
  }

  /**
   * Get responsive image URLs for different screen sizes
   * @param {string} imageUrl - Original image URL
   * @returns {Object} - Object with different sized URLs
   */
  getResponsiveUrls(imageUrl) {
    if (!this.isConfigured || !imageUrl) {
      const fallback = imageUrl || '/placeholder.jpg';
      return {
        thumbnail: fallback,
        small: fallback,
        medium: fallback,
        large: fallback,
        original: fallback
      };
    }

    return {
      thumbnail: this.getOptimizedUrl(imageUrl, { width: 150, height: 150, crop: 'fill' }),
      small: this.getOptimizedUrl(imageUrl, { width: 400, height: 300 }),
      medium: this.getOptimizedUrl(imageUrl, { width: 800, height: 600 }),
      large: this.getOptimizedUrl(imageUrl, { width: 1200, height: 900 }),
      original: this.getOptimizedUrl(imageUrl, { format: 'auto', quality: 95 })
    };
  }

  /**
   * Get gallery-specific optimized URL
   * @param {string} imageUrl - Original image URL
   * @param {string} size - Size preset (thumbnail, card, modal, fullscreen)
   * @returns {string} - Optimized image URL
   */
  getGalleryUrl(imageUrl, size = 'card') {
    const sizePresets = {
      thumbnail: { width: 150, height: 150, crop: 'fill' },
      card: { width: 600, height: 400, crop: 'fill' },
      modal: { width: 800, height: 600 },
      fullscreen: { width: 1920, height: 1080 },
      hero: { width: 1200, height: 800, crop: 'fill' }
    };

    const preset = sizePresets[size] || sizePresets.card;
    return this.getOptimizedUrl(imageUrl, preset);
  }

  /**
   * Upload image directly to Cloudimage (API key not available - using fallback)
   * @param {File} file - Image file to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Upload result
   */
  async uploadImage(file, options = {}) {
    console.warn('Direct upload not available without API key. Using fallback method.');
    
    // Return a mock successful upload for testing
    return {
      success: false,
      message: 'Direct upload not configured. File will be uploaded via backend.',
      originalFile: file,
      fallbackUrl: URL.createObjectURL(file),
      options
    };
  }

  /**
   * Generate srcSet for responsive images
   * @param {string} imageUrl - Original image URL
   * @param {Array} widths - Array of widths for srcSet
   * @returns {string} - srcSet string
   */
  generateSrcSet(imageUrl, widths = [400, 600, 800, 1200]) {
    if (!this.isConfigured || !imageUrl) {
      return imageUrl || '/placeholder.jpg';
    }

    return widths
      .map(width => `${this.getOptimizedUrl(imageUrl, { width })} ${width}w`)
      .join(', ');
  }

  /**
   * Check if Cloudimage is available and configured
   * @returns {boolean}
   */
  isAvailable() {
    return this.isConfigured;
  }

  /**
   * Get configuration status
   * @returns {Object}
   */
  getStatus() {
    return {
      configured: this.isConfigured,
      token: !!this.token,
      baseUrl: !!this.baseUrl,
      folder: this.folder,
      apiKeyRequired: false, // Not needed for URL optimization
      directUpload: false // Not available without API key
    };
  }

  /**
   * Test Cloudimage connection with a sample image
   * @returns {Promise<Object>}
   */
  async testConnection() {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Cloudimage not configured',
        details: this.getStatus()
      };
    }

    try {
      // Test with a sample public image URL
      const testImageUrl = 'sample.li/bag_demo.jpg';
      const optimizedUrl = this.getOptimizedUrl(testImageUrl, { width: 300, height: 200 });
      
      // Try to load the optimized image
      const testImage = new Image();
      
      return new Promise((resolve) => {
        testImage.onload = () => {
          resolve({
            success: true,
            message: 'Cloudimage connection successful!',
            testUrl: optimizedUrl,
            originalUrl: testImageUrl,
            optimizations: {
              width: 300,
              height: 200,
              format: 'auto'
            }
          });
        };
        
        testImage.onerror = () => {
          resolve({
            success: false,
            message: 'Failed to load optimized image',
            testUrl: optimizedUrl,
            originalUrl: testImageUrl
          });
        };
        
        // Set timeout for the test
        setTimeout(() => {
          resolve({
            success: false,
            message: 'Connection test timed out',
            testUrl: optimizedUrl
          });
        }, 5000);
        
        testImage.src = optimizedUrl;
      });
    } catch (error) {
      return {
        success: false,
        message: 'Connection test failed',
        error: error.message
      };
    }
  }
}

// Create singleton instance
const cloudimageService = new CloudimageService();

export default cloudimageService;

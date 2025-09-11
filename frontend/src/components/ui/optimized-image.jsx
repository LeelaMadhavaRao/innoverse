import React, { useState, useEffect } from 'react';
import { useGalleryImage } from '../../hooks/use-cloudimage';
import { motion } from 'framer-motion';

/**
 * Optimized Image component with Cloudimage integration
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
const OptimizedImage = ({
  src,
  alt = '',
  size = 'card',
  className = '',
  loading = 'lazy',
  showLoader = true,
  fallback = '/placeholder.jpg',
  onClick,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { galleryUrl, allSizes, isCloudimageEnabled } = useGalleryImage(src, size);

  const handleLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(true);
    e.target.src = fallback;
    onError?.(e);
  };

  const imageSrc = hasError ? fallback : galleryUrl;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {showLoader && !isLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Cloudimage status indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 z-10">
          <div
            className={`w-2 h-2 rounded-full ${
              isCloudimageEnabled ? 'bg-green-500' : 'bg-red-500'
            }`}
            title={isCloudimageEnabled ? 'Cloudimage enabled' : 'Cloudimage disabled'}
          />
        </div>
      )}

      {/* Main image */}
      <motion.img
        src={imageSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          onClick ? 'cursor-pointer' : ''
        }`}
        {...props}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center text-gray-400">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">Image not available</div>
        </div>
      )}
    </div>
  );
};

/**
 * Gallery-specific image component with hover effects
 */
export const GalleryImage = ({
  src,
  alt = '',
  title = '',
  className = '',
  onClick,
  showHoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      className={`relative group cursor-pointer overflow-hidden rounded-lg ${className}`}
      whileHover={showHoverEffect ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        size="card"
        onClick={onClick}
        className="transition-transform duration-300 group-hover:scale-110"
        {...props}
      />
      
      {/* Hover overlay */}
      {showHoverEffect && (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            🔍 View Details
          </motion.div>
        </div>
      )}
      
      {/* Title overlay */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-medium text-sm truncate">{title}</h3>
        </div>
      )}
    </motion.div>
  );
};

/**
 * Responsive image component with srcSet
 */
export const ResponsiveImage = ({
  src,
  alt = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  ...props
}) => {
  const { optimizedUrl, srcSet } = useGalleryImage(src);

  return (
    <OptimizedImage
      src={optimizedUrl}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default OptimizedImage;

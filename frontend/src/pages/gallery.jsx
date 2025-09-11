import { useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { galleryAPI, teamAPI } from '../lib/api';
import Navigation from '../components/navigation';
import OptimizedImage, { GalleryImage } from '../components/ui/optimized-image';
import { useGalleryImage } from '../hooks/use-cloudimage';
import cloudimageService from '../services/cloudimage';
import CloudimageStatus from '../components/ui/cloudimage-status';
import CloudimageTest from '../components/ui/cloudimage-test';

function Gallery() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');
  
  // Upload states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Check if user is authenticated (you can get this from auth context or localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Get toast hook
  const { addToast } = useToast();
  
  // Check if Cloudimage is available
  const isCloudimageEnabled = cloudimageService.isAvailable();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    loadGalleryItems();
    checkAuthentication();
  }, []);

  // Handle ESC key for full-screen modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showFullScreenImage) {
        setShowFullScreenImage(false);
      }
    };

    if (showFullScreenImage) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [showFullScreenImage]);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  };

  // Get current user info
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  };

  const loadGalleryItems = async () => {
    try {
      const response = await galleryAPI.getAll();
      
      // Handle both new format (with photos array) and old format (direct array)
      const galleryData = response.data.photos || response.data || [];
      setItems(galleryData);
    } catch (err) {
      setError('Failed to load gallery items');
      console.error('Gallery error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await galleryAPI.approve(id);
      loadGalleryItems();
    } catch (err) {
      console.error('Failed to approve item:', err);
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleFullScreenView = (imageUrl) => {
    setFullScreenImageUrl(imageUrl);
    setShowFullScreenImage(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      addToast({ title: 'Validation', description: 'Please provide both file and title', type: 'destructive' });
      return;
    }

    setUploadLoading(true);
    try {
      // Try to use Cloudimage-enhanced upload if available
      if (isCloudimageEnabled) {
        console.log('📸 Uploading with Cloudimage optimization enabled');
        
        try {
          // Use the enhanced gallery API that supports Cloudimage
          const uploadResult = await galleryAPI.uploadWithCloudimage(uploadFile, {
            title: uploadTitle,
            description: uploadDescription,
            category: 'general',
            tags: []
          });
          
          console.log('✅ Upload successful with Cloudimage integration:', uploadResult);
          addToast({ 
            title: 'Success', 
            description: 'Image uploaded successfully with Cloudimage optimization! It will be visible after admin approval.', 
            type: 'success' 
          });
        } catch (cloudError) {
          console.warn('⚠️ Cloudimage upload failed, falling back to regular upload:', cloudError);
          
          // Fallback to regular upload
          const formData = new FormData();
          formData.append('photos', uploadFile);
          formData.append('title', uploadTitle);
          formData.append('description', uploadDescription);

          await teamAPI.uploadToGallery(formData);
          addToast({ 
            title: 'Success', 
            description: 'Image uploaded successfully! It will be visible after admin approval.', 
            type: 'success' 
          });
        }
      } else {
        // Regular upload without Cloudimage
        console.log('📷 Uploading without Cloudimage optimization');
        const formData = new FormData();
        formData.append('photos', uploadFile);
        formData.append('title', uploadTitle);
        formData.append('description', uploadDescription);

        await teamAPI.uploadToGallery(formData);
        addToast({ 
          title: 'Success', 
          description: 'Image uploaded successfully! It will be visible after admin approval.', 
          type: 'success' 
        });
      }
      
      // Reset form
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      setShowUploadModal(false);
      
      // Refresh gallery
      loadGalleryItems();
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      addToast({ 
        title: 'Error', 
        description: 'Upload failed: ' + (error.response?.data?.message || error.message), 
        type: 'destructive' 
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const currentUser = getCurrentUser();
    
    // If not authenticated, only show approved items
    if (!currentUser) {
      return item.status === 'approved';
    }
    
    // Show all approved items from everyone
    if (item.status === 'approved') {
      return true;
    }
    
    // Show pending items only if they belong to the current user
    if (item.status === 'pending') {
      // Check if the item belongs to current user
      // Compare by user ID if available, otherwise by name or email
      if (item.uploadedBy && typeof item.uploadedBy === 'object') {
        return item.uploadedBy._id === currentUser.id || item.uploadedBy._id === currentUser._id;
      } else if (item.uploadedBy) {
        return item.uploadedBy === currentUser.id || item.uploadedBy === currentUser._id;
      } else if (item.uploadedByName) {
        return item.uploadedByName === currentUser.name;
      }
      // If no user info available, don't show pending items
      return false;
    }
    
    // Apply additional filter if set
    if (filter === 'all') return true;
    if (filter === 'approved') return item.status === 'approved';
    if (filter === 'pending') {
      // For pending filter, only show current user's pending items
      if (item.uploadedBy && typeof item.uploadedBy === 'object') {
        return item.uploadedBy._id === currentUser.id || item.uploadedBy._id === currentUser._id;
      } else if (item.uploadedBy) {
        return item.uploadedBy === currentUser.id || item.uploadedBy === currentUser._id;
      } else if (item.uploadedByName) {
        return item.uploadedByName === currentUser.name;
      }
      return false;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-400 text-xl">{error}</p>
            <Button 
              onClick={loadGalleryItems} 
              className="mt-4 bg-purple-600 hover:bg-purple-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 mb-6 px-4 py-2 text-lg">
                Public Gallery
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Project
              </span>
              <br />
              <span className="text-white">Gallery</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-300"
            >
              Explore innovative projects and creative works from our talented participants. 
              Discover the future of technology and innovation.
            </motion.p>

            {/* Filter Tabs and Upload Button */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <div className="inline-flex bg-gray-800/50 backdrop-blur-lg rounded-xl p-2 border border-gray-700/50">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === 'all'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  All Projects
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === 'approved'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Approved Only
                </button>
                {/* Only show My Pending button for authenticated users */}
                {isAuthenticated && (
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      filter === 'pending'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    My Pending
                  </button>
                )}
              </div>
              
              {/* Upload Button - Only show for authenticated teams */}
              {isAuthenticated && userRole === 'team' && (
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  📸 Upload Photo
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl md:text-8xl mb-6">🖼️</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-4">No Projects Found</h3>
              <p className="text-gray-500 mb-8">
                {filter === 'all' 
                  ? 'No projects have been submitted yet.' 
                  : `No ${filter} projects at the moment.`
                }
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={fadeInUp}
                  whileHover={cardHover.hover}
                  initial={cardHover.rest}
                  className="group cursor-pointer"
                >
                  <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-700/50 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-purple-500/50 h-full">
                    {/* Project Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <GalleryImage
                        src={item.url || item.images?.[0]}
                        alt={item.title}
                        title={item.title}
                        onClick={() => handleView(item)}
                        className="w-full h-full"
                        showHoverEffect={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge className={`text-xs ${
                          item.status === 'approved' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        } border`}>
                          {item.status?.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {/* Team Name */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border text-xs">
                          {item.teamName}
                        </Badge>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>📅 {new Date(item.uploadDate || item.createdAt).toLocaleDateString()}</span>
                        <span>👤 {item.uploadedBy?.name || item.uploadedByName || 'Unknown'}</span>
                      </div>
                      
                      {/* View Button */}
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-center justify-center py-2 px-4 bg-purple-600/20 rounded-lg border border-purple-500/30 cursor-pointer transition-all duration-200 hover:bg-purple-600/30"
                          onClick={() => handleView(item)}
                        >
                          <span className="text-purple-400 font-medium">View Details →</span>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8"
          >
            <motion.div variants={fadeInUp} className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">{items.length}</div>
              <div className="text-gray-400 text-sm md:text-base">Total Projects</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
              <div className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {items.filter(item => item.status === 'approved').length}
              </div>
              <div className="text-gray-400 text-sm md:text-base">Approved</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="text-center p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                {items.filter(item => item.status === 'pending').length}
              </div>
              <div className="text-gray-400 text-sm md:text-base">Pending Review</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-gray-900 rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Upload Photo</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-purple-600 file:text-white file:rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <Input
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter image title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Enter image description"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadLoading || !uploadFile || !uploadTitle}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="relative group cursor-pointer" onClick={() => handleFullScreenView(selectedItem.url || selectedItem.images?.[0] || '/placeholder.jpg')}>
                    <OptimizedImage
                      src={selectedItem.url || selectedItem.images?.[0]}
                      alt={selectedItem.title}
                      size="modal"
                      className="w-full h-auto rounded-lg transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        🔍 Click to view full screen
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Description</h3>
                    <p className="text-gray-400">{selectedItem.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Team</h3>
                    <p className="text-gray-400">{selectedItem.teamName}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Uploaded By</h3>
                    <p className="text-gray-400">{selectedItem.uploadedBy?.name || selectedItem.uploadedByName || 'Unknown'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Upload Date</h3>
                    <p className="text-gray-400">{new Date(selectedItem.uploadDate || selectedItem.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Status</h3>
                    <Badge className={`${
                      selectedItem.status === 'approved' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    } border`}>
                      {selectedItem.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Image Modal */}
      {showFullScreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowFullScreenImage(false)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
            {/* Close Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFullScreenImage(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 border-gray-600 text-white hover:bg-black/70 hover:text-white"
            >
              ✕ Close
            </Button>
            
            {/* Full Screen Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={fullScreenImageUrl}
                alt="Full screen view"
                size="fullscreen"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                showLoader={true}
              />
            </motion.div>
            
            {/* Optional: Image controls/info overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-3 text-white text-center backdrop-blur-sm">
              <p className="text-sm">Press ESC or click outside to close</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Cloudimage Status (Development only) */}
      <CloudimageStatus />
      
      {/* Cloudimage Test Component */}
      <CloudimageTest />
    </div>
  );
}

export default Gallery;

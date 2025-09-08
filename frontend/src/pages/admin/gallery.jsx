import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Dialog } from '../../components/ui/dialog';
import { galleryAPI } from '../../lib/api';

function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'general',
    tags: ''
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await galleryAPI.getAll();
      console.log('Admin gallery response:', response.data);
      
      // Handle both new format (with photos array) and old format (direct array)
      const galleryData = response.data.photos || response.data || [];
      setPhotos(galleryData);
    } catch (error) {
      console.error('Error fetching photos:', error);
      // Fallback to empty array if API fails
      setPhotos([]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setLoading(true);

    try {
      // This would be actual file upload logic
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', uploadData.title || file.name);
        formData.append('description', uploadData.description);
        formData.append('category', uploadData.category);
        formData.append('tags', uploadData.tags);

        // Mock upload - replace with actual API call
        console.log('Uploading file:', file.name, uploadData);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          id: Date.now() + Math.random(),
          title: uploadData.title || file.name,
          description: uploadData.description,
          url: URL.createObjectURL(file), // In real app, this would be the server URL
          category: uploadData.category,
          tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          createdAt: new Date().toISOString(),
          uploadedBy: "Admin",
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          dimensions: "Unknown", // Would be determined by server
          status: "approved"
        };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      setPhotos(prev => [...uploadedPhotos, ...prev]);

      // Reset form
      setUploadData({
        title: '',
        description: '',
        category: 'general',
        tags: ''
      });
      setSelectedFiles([]);
      setShowUploadForm(false);

      alert(`Successfully uploaded ${uploadedPhotos.length} photo(s)!`);
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Error uploading photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await galleryAPI.delete(photoId);
      // Refresh the photos list
      await fetchPhotos();
      alert('Photo deleted successfully!');
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo: ' + (error.response?.data?.message || error.message));
    }
  };

  const approvePhoto = async (photoId) => {
    try {
      await galleryAPI.approve(photoId);
      // Refresh the photos list to show updated status
      await fetchPhotos();
      alert('Photo approved successfully!');
    } catch (error) {
      console.error('Error approving photo:', error);
      alert('Error approving photo: ' + (error.response?.data?.message || error.message));
    }
  };

  const downloadPhoto = (photo) => {
    // In a real app, this would download from server
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.title;
    link.click();
  };

  const viewPhotoDetails = (photo) => {
    setSelectedPhoto(photo);
    setShowViewModal(true);
  };

  const bulkDownload = () => {
    const approvedPhotos = photos.filter(photo => photo.status === 'approved');
    if (approvedPhotos.length === 0) {
      alert('No approved photos to download');
      return;
    }

    // In a real app, this would create a zip file
    alert(`Preparing download of ${approvedPhotos.length} photos...`);
    approvedPhotos.forEach(photo => downloadPhoto(photo));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Event Gallery Management
                </h1>
                <p className="text-gray-400 text-lg">
                  Upload and manage photos from Innoverse 2025 event
                </p>
              </div>
              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={bulkDownload}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    📦 Bulk Download
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                  >
                    {showUploadForm ? '❌ Cancel' : '📸 Upload Photos'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Upload Form */}
          {showUploadForm && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <span className="text-2xl mr-3">📸</span>
                    Upload Event Photos
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select Photos * (Multiple files supported)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        required
                      />
                      {selectedFiles.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-400">
                            Selected {selectedFiles.length} file(s):
                          </p>
                          <ul className="text-sm text-gray-300 mt-1">
                            {selectedFiles.map((file, index) => (
                              <li key={index} className="truncate">
                                • {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Title (Optional)
                        </label>
                        <Input
                          value={uploadData.title}
                          onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                          placeholder="Event photo title"
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Leave empty to use filename
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Category
                        </label>
                        <select
                          value={uploadData.category}
                          onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                        >
                          <option value="general">General</option>
                          <option value="ceremony">Opening/Closing Ceremony</option>
                          <option value="presentations">Team Presentations</option>
                          <option value="networking">Networking Sessions</option>
                          <option value="awards">Awards & Recognition</option>
                          <option value="behind-scenes">Behind the Scenes</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description (Optional)
                      </label>
                      <Textarea
                        value={uploadData.description}
                        onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                        placeholder="Describe what's happening in the photo(s)"
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tags (Optional)
                      </label>
                      <Input
                        value={uploadData.tags}
                        onChange={(e) => setUploadData({...uploadData, tags: e.target.value})}
                        placeholder="team1, innovation, presentation (comma separated)"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    <div className="flex gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                        >
                          {loading ? '⏳ Uploading...' : '✅ Upload Photos'}
                        </Button>
                      </motion.div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowUploadForm(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Gallery Stats */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/20 backdrop-blur-sm">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">{photos.length}</div>
                  <div className="text-gray-300">Total Photos</div>
                </div>
              </Card>
              <Card className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-500/20 backdrop-blur-sm">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {photos.filter(p => p.status === 'approved').length}
                  </div>
                  <div className="text-gray-300">Approved</div>
                </div>
              </Card>
              <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/20 backdrop-blur-sm">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {photos.filter(p => p.status === 'pending').length}
                  </div>
                  <div className="text-gray-300">Pending Review</div>
                </div>
              </Card>
              <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/20 backdrop-blur-sm">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    {[...new Set(photos.map(p => p.category))].length}
                  </div>
                  <div className="text-gray-300">Categories</div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Photo Gallery */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">🖼️</span>
                  Event Photos ({photos.length})
                </h3>
              </div>
              <div className="p-6">
                {photos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No photos uploaded yet</h3>
                    <p className="text-gray-400">
                      Upload photos to capture memories from Innoverse 2025
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map((photo) => (
                      <motion.div
                        key={photo._id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl border border-gray-600/30 overflow-hidden backdrop-blur-sm"
                      >
                        <div className="relative">
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <Badge className={getStatusColor(photo.status)}>
                              {photo.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="text-lg font-bold text-white mb-2 truncate">
                            {photo.title}
                          </h4>
                          
                          {photo.description && (
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {photo.description}
                            </p>
                          )}
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Category:</span>
                              <span className="text-gray-300 capitalize">{photo.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Size:</span>
                              <span className="text-gray-300">{photo.size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Uploaded By:</span>
                              <span className="text-gray-300">{photo.uploadedBy?.name || photo.uploadedByName || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Uploaded:</span>
                              <span className="text-gray-300">
                                {photo.createdAt ? new Date(photo.createdAt).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                          </div>

                          {photo.tags && photo.tags.length > 0 && (
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {photo.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => viewPhotoDetails(photo)}
                              className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                            >
                              👁️ View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => downloadPhoto(photo)}
                              className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
                            >
                              📥 Download
                            </Button>
                            {photo.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => approvePhoto(photo._id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                ✅ Approve
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deletePhoto(photo._id)}
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* View Details Modal */}
          {selectedPhoto && (
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-gray-900 rounded-2xl border border-gray-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Photo Details</h2>
                    <Button
                      onClick={() => setShowViewModal(false)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-400 hover:bg-gray-800"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Section */}
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={selectedPhoto.url || selectedPhoto.imageUrl || '/placeholder.jpg'}
                          alt={selectedPhoto.title}
                          className="w-full h-64 lg:h-80 object-cover rounded-lg border border-gray-700"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg';
                          }}
                        />
                        <Badge 
                          className={`absolute top-2 right-2 ${
                            selectedPhoto.status === 'approved' 
                              ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' 
                              : selectedPhoto.status === 'pending'
                              ? 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30'
                              : 'bg-red-600/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {selectedPhoto.status}
                        </Badge>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => downloadPhoto(selectedPhoto)}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white flex-1"
                        >
                          📥 Download
                        </Button>
                        {selectedPhoto.status === 'pending' && (
                          <Button
                            onClick={() => {
                              approvePhoto(selectedPhoto._id);
                              setShowViewModal(false);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                          >
                            ✅ Approve
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            deletePhoto(selectedPhoto._id);
                            setShowViewModal(false);
                          }}
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-900/20 flex-1"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{selectedPhoto.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {selectedPhoto.description || 'No description available'}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Category:</span>
                          <span className="text-gray-300 capitalize">{selectedPhoto.category}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">File Size:</span>
                          <span className="text-gray-300">
                            {selectedPhoto.size ? `${(selectedPhoto.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Uploaded By:</span>
                          <span className="text-gray-300">
                            {selectedPhoto.uploadedBy?.name || selectedPhoto.uploadedByName || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Upload Date:</span>
                          <span className="text-gray-300">
                            {selectedPhoto.createdAt ? new Date(selectedPhoto.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                        {selectedPhoto.approvedAt && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Approved Date:</span>
                            <span className="text-gray-300">
                              {new Date(selectedPhoto.approvedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {selectedPhoto.approvedBy && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Approved By:</span>
                            <span className="text-gray-300">
                              {selectedPhoto.approvedBy.name || 'Admin'}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Views:</span>
                          <span className="text-gray-300">{selectedPhoto.views || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Downloads:</span>
                          <span className="text-gray-300">{selectedPhoto.downloads || 0}</span>
                        </div>
                      </div>

                      {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
                        <div>
                          <span className="text-gray-400 text-sm block mb-2">Tags:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedPhoto.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedPhoto.dimensions && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Dimensions:</span>
                          <span className="text-gray-300">
                            {selectedPhoto.dimensions.width} × {selectedPhoto.dimensions.height}px
                          </span>
                        </div>
                      )}

                      {selectedPhoto.metadata?.camera && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Camera:</span>
                          <span className="text-gray-300">{selectedPhoto.metadata.camera}</span>
                        </div>
                      )}

                      {selectedPhoto.metadata?.location && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-gray-300">{selectedPhoto.metadata.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </Dialog>
          )}
    </motion.div>
  );
}

export default AdminGallery;

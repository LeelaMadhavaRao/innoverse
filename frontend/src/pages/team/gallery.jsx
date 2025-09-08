import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teamAPI } from '../../lib/api';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../context/auth-context';
import Navigation from '../../components/navigation';

export default function TeamGallery() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const { toast } = useToast();

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
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getGallery();
      if (response.success && response.data) {
        setSubmissions(response.data.items || response.data || []);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Gallery fetch error:', error);
      setSubmissions([]);
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast({
        title: "Error",
        description: "Please provide both file and title",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      formData.append('title', uploadTitle);
      formData.append('description', uploadDescription);

      const response = await teamAPI.uploadToGallery(formData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadTitle('');
        setUploadDescription('');
        fetchSubmissions(); // Refresh the gallery
      } else {
        toast({
          title: "Error",
          description: response.message || "Upload failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'EdTech': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'IoT': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'GreenTech': 'bg-green-500/20 text-green-400 border-green-500/30',
      'FinTech': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'HealthTech': 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 mb-6 px-4 py-2 text-lg">
                Team Gallery
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Your
              </span>
              <br />
              <span className="text-white">Project Showcase</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-300"
            >
              Manage and showcase your innovative projects. Upload new submissions and track their approval status.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-2xl"
                >
                  📤 Upload New Project
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-teal-500/50 text-teal-400 hover:bg-teal-600/10 px-8 py-4 text-lg backdrop-blur-sm"
                  onClick={fetchSubmissions}
                >
                  🔄 Refresh Gallery
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {submissions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">📸</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-4">No Projects Yet</h3>
              <p className="text-gray-500 mb-8">Upload your first project to get started!</p>
              <Button 
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                📤 Upload First Project
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {submissions.map((submission, index) => (
                <motion.div
                  key={submission._id}
                  variants={fadeInUp}
                  whileHover={cardHover.hover}
                  initial={cardHover.rest}
                  className="group cursor-pointer"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-700/50 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-purple-500/50 h-full">
                    {/* Project Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={submission.images?.[0] || '/placeholder.jpg'} 
                        alt={submission.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${getStatusColor(submission.status)} border`}>
                          {submission.status?.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(submission.category)} border`}>
                          {submission.category}
                        </Badge>
                      </div>

                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 flex space-x-4">
                        <div className="flex items-center space-x-1 text-sm text-white">
                          <span>👁️</span>
                          <span>{submission.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-white">
                          <span>❤️</span>
                          <span>{submission.likes}</span>
                        </div>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {submission.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {submission.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>📅 {new Date(submission.uploadDate).toLocaleDateString()}</span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
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
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-4 right-4 bg-red-600/80 backdrop-blur-sm text-white rounded-full p-3 hover:bg-red-700/80 transition-all duration-200 z-20"
              >
                ✕
              </motion.button>

              <div className="p-8 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={`${getStatusColor(selectedSubmission.status)} border`}>
                      {selectedSubmission.status?.toUpperCase()}
                    </Badge>
                    <Badge className={`${getCategoryColor(selectedSubmission.category)} border`}>
                      {selectedSubmission.category}
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedSubmission.title}</h2>
                  <p className="text-gray-400">{selectedSubmission.description}</p>
                </div>

                {/* Project Image */}
                <div className="mb-6">
                  <img 
                    src={selectedSubmission.images?.[0] || '/placeholder.jpg'} 
                    alt={selectedSubmission.title}
                    className="w-full max-h-96 object-cover rounded-xl"
                  />
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">👁️</div>
                    <div className="text-lg font-bold text-blue-400">{selectedSubmission.views}</div>
                    <div className="text-sm text-gray-400">Views</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">❤️</div>
                    <div className="text-lg font-bold text-red-400">{selectedSubmission.likes}</div>
                    <div className="text-sm text-gray-400">Likes</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="text-lg font-bold text-green-400">{new Date(selectedSubmission.uploadDate).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-400">Uploaded</div>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-xl text-center">
                    <div className="text-2xl mb-2">🏷️</div>
                    <div className="text-lg font-bold text-purple-400">{selectedSubmission.category}</div>
                    <div className="text-sm text-gray-400">Category</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    ✏️ Edit Project
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10">
                    🗑️ Delete Project
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6">📤 Upload New Project</h3>
              
              <form onSubmit={handleUpload} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    required
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 outline-none"
                    placeholder="Enter project title..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 outline-none resize-none"
                    rows="4"
                    placeholder="Describe your project..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Upload Project
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

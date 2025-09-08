import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { galleryAPI } from '../lib/api';
import Navigation from '../components/navigation';

function Gallery() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

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
  }, []);

  const loadGalleryItems = async () => {
    try {
      const response = await galleryAPI.getAll();
      console.log('Gallery response:', response.data);
      
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

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'approved') return item.status === 'approved';
    if (filter === 'pending') return item.status === 'pending';
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

            {/* Filter Tabs */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-0"
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
                  Approved
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === 'pending'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Pending
                </button>
              </div>
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
                      <img 
                        src={item.images?.[0] || '/placeholder.jpg'} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>📅 {new Date(item.uploadDate).toLocaleDateString()}</span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="text-purple-400 font-medium">View →</span>
                        </motion.div>
                      </div>
                      
                      {/* Admin Actions for pending items */}
                      {item.status === 'pending' && (
                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                          <Button 
                            onClick={() => handleApprove(item._id)}
                            size="sm"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            Approve
                          </Button>
                        </div>
                      )}
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
    </div>
  );
}

export default Gallery;

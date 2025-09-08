import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { posterLaunchAPI } from '../lib/api';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const LaunchedPostersDisplay = () => {
  const [launchedPosters, setLaunchedPosters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoster, setSelectedPoster] = useState(null);

  useEffect(() => {
    fetchLaunchedPosters();
  }, []);

  const fetchLaunchedPosters = async () => {
    try {
      setLoading(true);
      const response = await posterLaunchAPI.getPublicLaunchedPosters();
      setLaunchedPosters(response.data.data || []);
    } catch (error) {
      console.error('Error fetching launched posters:', error);
      setLaunchedPosters([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePosterClick = async (poster) => {
    setSelectedPoster(poster);
    
    // Increment view count
    try {
      await posterLaunchAPI.incrementPosterView(poster.posterId);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleClosePoster = () => {
    setSelectedPoster(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="w-16 h-16 border-4 border-gray-600 border-t-emerald-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (launchedPosters.length === 0) {
    return null; // Don't show anything if no posters are launched
  }

  return (
    <>
      {/* Launched Posters Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🚀 <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Featured Events
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our latest announcements and events happening right now
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {launchedPosters.map((poster, index) => (
              <motion.div
                key={poster.posterId}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
                onClick={() => handlePosterClick(poster)}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden h-full hover:bg-gray-800/70 transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={poster.imageUrl} 
                      alt={poster.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-600 text-white">
                        LIVE
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {poster.title}
                    </h3>
                    {poster.subtitle && (
                      <p className="text-emerald-400 font-semibold mb-2">
                        {poster.subtitle}
                      </p>
                    )}
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {poster.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{poster.date}</span>
                      <span>{poster.organizer}</span>
                    </div>
                    
                    {poster.analytics && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>👁️ {poster.analytics.views} views</span>
                          <span className="text-emerald-400">Click to view</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Poster Display Modal */}
      <AnimatePresence>
        {selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClosePoster}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: -90 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateX: 90 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                duration: 1
              }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Spectacular Background Effects */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, Math.random() * 400 - 200],
                      y: [0, Math.random() * 600 - 300],
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      delay: Math.random() * 1,
                      repeat: Infinity,
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
              </div>

              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClosePoster}
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/20 transition-all duration-200 z-20"
                >
                  ✕
                </motion.button>

                {/* Poster Content */}
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Poster Image */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex-1"
                  >
                    <img 
                      src={selectedPoster.imageUrl} 
                      alt={selectedPoster.title}
                      className="w-full h-auto max-h-[70vh] object-contain mx-auto rounded-xl"
                    />
                  </motion.div>

                  {/* Event Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:w-80 w-full bg-emerald-600/10 backdrop-blur-md rounded-xl p-6 text-center flex flex-col justify-center"
                  >
                    <Badge className="bg-emerald-600 text-white mb-4 mx-auto">
                      FEATURED EVENT
                    </Badge>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedPoster.title}
                    </h2>
                    
                    {selectedPoster.subtitle && (
                      <p className="text-emerald-400 font-semibold mb-4">
                        {selectedPoster.subtitle}
                      </p>
                    )}
                    
                    <p className="text-gray-300 mb-6">
                      {selectedPoster.description}
                    </p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{selectedPoster.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Organizer:</span>
                        <span className="text-white">{selectedPoster.organizer}</span>
                      </div>
                      {selectedPoster.analytics && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Views:</span>
                          <span className="text-emerald-400">{selectedPoster.analytics.views}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      onClick={handleClosePoster}
                      className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                    >
                      ✨ Close
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LaunchedPostersDisplay;

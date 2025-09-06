import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { adminAPI } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

function AdminPosterLaunch() {
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [launchLoading, setLaunchLoading] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [launchConfig, setLaunchConfig] = useState({
    scheduledTime: '',
    duration: '24',
    targetAudience: 'all',
    message: '',
    priority: 'high'
  });
  const [launchedPosters, setLaunchedPosters] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const { addToast: toast } = useToast();

  // Predefined posters data
  const predefinedPosters = [
    {
      id: 'innoverse-2025',
      title: 'Innoverse 2025',
      subtitle: 'Startup Contest',
      description: 'A Startup Contest where we dive deep into the brain for bold ideas',
      tagline: 'Your Pitch. Your Future',
      date: 'SEPTEMBER 15 2K25',
      organizer: 'CSIT DEPARTMENT',
      theme: 'startup-innovation',
      imageUrl: '/innoverse-poster.jpg',
      colors: {
        primary: '#8B5CF6',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)'
      },
      sponsors: ['Dhimavaram', 'Smart work', 'TechGuru', 'InnovaDelight'],
      hods: ['Dr N. Gopi Krishna Murthy', 'Dr M. Suresh Babu'],
      faculty: ['Mr. P.S.V. Surya Kumar', 'Mr. N. Praveen', 'Mr. P. Manoj'],
      status: 'ready'
    },
    {
      id: 'tech-symposium-2025',
      title: 'Tech Symposium 2025',
      subtitle: 'Innovation & Technology',
      description: 'A comprehensive technology symposium featuring cutting-edge innovations',
      tagline: 'Shape the Future',
      date: 'OCTOBER 20 2K25',
      organizer: 'TECH DEPARTMENT',
      theme: 'tech-innovation',
      imageUrl: '/tech-symposium-poster.jpg',
      colors: {
        primary: '#10B981',
        secondary: '#3B82F6',
        accent: '#F59E0B',
        background: 'linear-gradient(135deg, #065f46 0%, #1e40af 50%, #7c3aed 100%)'
      },
      sponsors: ['TechCorp', 'InnovateNow', 'FutureTech', 'DigitalPro'],
      hods: ['Dr. A. Kumar', 'Dr. S. Sharma'],
      faculty: ['Mr. R. Patel', 'Ms. A. Singh', 'Dr. M. Gupta'],
      status: 'ready'
    }
  ];

  useEffect(() => {
    fetchPosters();
    fetchLaunchedPosters();
  }, []);

  const fetchPosters = async () => {
    setLoading(true);
    try {
      setPosters(predefinedPosters);
    } catch (error) {
      console.error('❌ Error fetching posters:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch posters',
        type: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLaunchedPosters = async () => {
    try {
      const response = await adminAPI.getLaunchedPosters();
      setLaunchedPosters(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching launched posters:', error);
    }
  };

  const handleLaunchPoster = async () => {
    if (!selectedPoster) return;

    try {
      setLaunchLoading(true);
      
      const launchData = {
        posterId: selectedPoster.id,
        posterData: selectedPoster,
        config: launchConfig,
        launchedAt: new Date().toISOString(),
        launchedBy: 'admin'
      };

      await adminAPI.launchPoster(launchData);
      
      toast({
        title: '🚀 Poster Launched!',
        description: `${selectedPoster.title} has been launched successfully with stunning effects!`,
        type: 'success',
      });

      setShowLaunchModal(false);
      setSelectedPoster(null);
      setLaunchConfig({
        scheduledTime: '',
        duration: '24',
        targetAudience: 'all',
        message: '',
        priority: 'high'
      });
      
      fetchLaunchedPosters();
      
    } catch (error) {
      console.error('❌ Error launching poster:', error);
      toast({
        title: 'Error',
        description: 'Failed to launch poster',
        type: 'destructive',
      });
    } finally {
      setLaunchLoading(false);
    }
  };

  const handleStopLaunch = async (posterId) => {
    try {
      await adminAPI.stopPosterLaunch(posterId);
      toast({
        title: 'Launch Stopped',
        description: 'Poster launch has been stopped',
        type: 'success',
      });
      fetchLaunchedPosters();
    } catch (error) {
      console.error('❌ Error stopping launch:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop poster launch',
        type: 'destructive',
      });
    }
  };

  const PosterPreview = ({ poster }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateY: 180 }}
      transition={{ 
        duration: 0.8, 
        type: "spring", 
        stiffness: 100,
        rotateY: { duration: 1.2, ease: "easeInOut" }
      }}
      className="relative w-full max-w-2xl mx-auto perspective-1000"
    >
      <motion.div
        whileHover={{ 
          scale: 1.02,
          rotateX: 5,
          rotateY: 5,
          transition: { duration: 0.3 }
        }}
        className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-3xl p-8 shadow-2xl transform-gpu"
        style={{
          background: poster.colors?.background || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              animate={{
                x: [0, Math.random() * 400],
                y: [0, Math.random() * 600],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
          >
            {poster.title}
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl font-semibold mb-6 text-purple-200"
          >
            {poster.subtitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg mb-8 text-gray-300 leading-relaxed"
          >
            {poster.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mb-6"
          >
            <motion.p 
              className="text-3xl font-bold text-yellow-400 mb-2"
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 10px rgba(251, 191, 36, 0.5)',
                  '0 0 20px rgba(251, 191, 36, 0.8)',
                  '0 0 10px rgba(251, 191, 36, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {poster.tagline}
            </motion.p>
            
            <motion.p
              className="text-xl text-blue-200 font-mono tracking-wider"
              initial={{ letterSpacing: '0.1em' }}
              animate={{ letterSpacing: ['0.1em', '0.15em', '0.1em'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {poster.date}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              className="inline-block bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }}
            >
              <motion.span 
                className="text-green-400 font-semibold text-lg"
                animate={{ 
                  color: ['#10B981', '#34D399', '#10B981']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {poster.organizer}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Faculty and sponsors */}
          {poster.faculty && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-8 text-sm text-gray-400"
            >
              <p className="mb-2">Faculty: {poster.faculty.join(', ')}</p>
              {poster.sponsors && (
                <p>Sponsors: {poster.sponsors.join(', ')}</p>
              )}
            </motion.div>
          )}
        </div>

        {/* 3D glow effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-30"
          animate={{
            boxShadow: [
              '0 0 20px rgba(139, 92, 246, 0.3)',
              '0 0 40px rgba(139, 92, 246, 0.6)',
              '0 0 20px rgba(139, 92, 246, 0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );

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
      className="p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          🚀 Poster Launch Control Center
        </h1>
        <p className="text-gray-600 text-lg">
          Launch stunning poster campaigns with spectacular 3D effects and animations
        </p>
      </motion.div>

      {/* Available Posters Section */}
      <motion.div
        variants={itemVariants}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Posters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posters.map((poster, index) => (
            <motion.div
              key={poster.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              }}
              className="relative group"
            >
              <Card className="h-full bg-white/70 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{poster.title}</h3>
                    <Badge 
                      className={`${
                        poster.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
                      } text-white`}
                    >
                      {poster.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{poster.description}</p>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => {
                        setSelectedPoster(poster);
                        setShowPreview(true);
                      }}
                      variant="outline"
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      👁️ Preview Poster
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setSelectedPoster(poster);
                        setShowLaunchModal(true);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform transition-all duration-200 hover:scale-105"
                    >
                      🚀 Launch Campaign
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Launched Posters Section */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 Active Campaigns</h2>
        {launchedPosters.length === 0 ? (
          <Card className="p-8 text-center bg-white/50 backdrop-blur-md border-dashed border-2 border-gray-300">
            <div className="text-gray-500">
              <div className="text-4xl mb-4">🎪</div>
              <p className="text-lg">No active campaigns yet</p>
              <p className="text-sm mt-2">Launch your first poster to see it here!</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {launchedPosters.map((launch) => (
              <motion.div
                key={launch.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group"
              >
                <Card className="h-full bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">{launch.posterData?.title}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-600 font-medium">Live</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      Launched: {new Date(launch.launchedAt).toLocaleDateString()}
                    </p>
                    
                    <Button
                      onClick={() => handleStopLaunch(launch.posterId)}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      ⏹️ Stop Campaign
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <PosterPreview poster={selectedPoster} />
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/30 transition-all duration-200"
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch Configuration Modal */}
      <AnimatePresence>
        {showLaunchModal && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto"
            >
              <motion.form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLaunchPoster();
                }}
                className="p-6"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  🚀 Launch Configuration
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Duration (hours)
                    </label>
                    <Input
                      type="number"
                      value={launchConfig.duration}
                      onChange={(e) => setLaunchConfig({...launchConfig, duration: e.target.value})}
                      placeholder="24"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={launchConfig.targetAudience}
                      onChange={(e) => setLaunchConfig({...launchConfig, targetAudience: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students Only</option>
                      <option value="faculty">Faculty Only</option>
                      <option value="external">External Visitors</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Message
                    </label>
                    <Textarea
                      value={launchConfig.message}
                      onChange={(e) => setLaunchConfig({...launchConfig, message: e.target.value})}
                      placeholder="Special announcement or promotional message..."
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select
                      value={launchConfig.priority}
                      onChange={(e) => setLaunchConfig({...launchConfig, priority: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={launchLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    {launchLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Launching...
                      </div>
                    ) : (
                      '🚀 Launch Now!'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={() => setShowLaunchModal(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AdminPosterLaunch;

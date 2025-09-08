import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { adminAPI } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

function AdminPosterLaunch() {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showPosterDisplay, setShowPosterDisplay] = useState(false);
  const [launchLoading, setLaunchLoading] = useState(false);
  const [launchedPosters, setLaunchedPosters] = useState([]);
  const { addToast: toast } = useToast();

  // Poster data with actual images
  const posters = [
    {
      id: 'innoverse-2025',
      title: 'Innoverse Event',
      subtitle: 'Startup Innovation Contest',
      description: 'A premier startup contest where we dive deep into innovative ideas and entrepreneurial solutions',
      date: 'September 15-16, 2025',
      organizer: 'CSIT Department',
      imageUrl: '/innoverse.jpg',
      status: 'ready',
      theme: 'innovation'
    },
    {
      id: 'potluck-lunch-2025',
      title: 'Potluck Lunch Event',
      subtitle: 'Community Gathering',
      description: 'Join us for a delightful potluck lunch event bringing together our community',
      date: 'September 20, 2025',
      organizer: 'Community Team',
      imageUrl: '/potluck.jpg',
      status: 'ready',
      theme: 'community'
    }
  ];

  useEffect(() => {
    fetchLaunchedPosters();
  }, []);

  const fetchLaunchedPosters = async () => {
    try {
      const response = await adminAPI.getLaunchedPosters();
      setLaunchedPosters(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching launched posters:', error);
    }
  };

  const handleSelectPoster = (poster) => {
    setSelectedPoster(poster);
    setShowPosterDisplay(true);
  };

  const handleLaunchPoster = async () => {
    if (!selectedPoster) return;

    try {
      setLaunchLoading(true);
      
      const launchData = {
        posterId: selectedPoster.id,
        posterData: selectedPoster,
        launchedAt: new Date().toISOString(),
        launchedBy: 'admin'
      };

      await adminAPI.launchPoster(launchData);
      
      toast({
        title: '🚀 Poster Launched Successfully!',
        description: `${selectedPoster.title} has been launched with spectacular effects!`,
        type: 'success',
      });

      setShowPosterDisplay(false);
      setSelectedPoster(null);
      fetchLaunchedPosters();
      
    } catch (error) {
      console.error('❌ Error launching poster:', error);
      toast({
        title: 'Launch Failed',
        description: 'Failed to launch poster. Please try again.',
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
        title: 'Campaign Stopped',
        description: 'Poster campaign has been stopped successfully',
        type: 'success',
      });
      fetchLaunchedPosters();
    } catch (error) {
      console.error('❌ Error stopping launch:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop poster campaign',
        type: 'destructive',
      });
    }
  };

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
        staggerChildren: 0.2
      }
    }
  };

  const floatingParticles = Array.from({ length: 50 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-30"
      animate={{
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
      style={{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_75%)]" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {floatingParticles}
        </div>

        {/* Gradient Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="px-4 py-12 mx-auto max-w-7xl lg:px-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 mb-6 px-6 py-3 text-lg">
              🚀 Poster Launch Center
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Launch
              </span>
              <br />
              <span className="text-white">Spectacular Campaigns</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-300">
              Create stunning poster campaigns with breathtaking visual effects and animations
            </p>
          </motion.div>

          {/* Poster Selection Cards */}
          <motion.div variants={fadeInUp} className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Select Poster to Launch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {posters.map((poster, index) => (
                <motion.div
                  key={poster.id}
                  variants={fadeInUp}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer"
                  onClick={() => handleSelectPoster(poster)}
                >
                  <Card className="relative h-80 bg-white/5 backdrop-blur-md border-white/10 overflow-hidden hover:border-emerald-400/50 transition-all duration-300">
                    {/* Card Background Image */}
                    <div className="absolute inset-0">
                      <img 
                        src={poster.imageUrl} 
                        alt={poster.title}
                        className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={`${
                            poster.theme === 'innovation' 
                              ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' 
                              : 'bg-purple-600/20 text-purple-400 border-purple-500/30'
                          }`}>
                            {poster.status}
                          </Badge>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="text-2xl"
                          >
                            🎯
                          </motion.div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                          {poster.title}
                        </h3>
                        <p className="text-gray-300 mb-3 line-clamp-2">
                          {poster.description}
                        </p>
                        <p className="text-emerald-400 font-semibold">
                          {poster.date}
                        </p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0">
                          🚀 Select & Launch
                        </Button>
                      </motion.div>
                    </div>

                    {/* Hover Effects */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Active Campaigns */}
          {launchedPosters.length > 0 && (
            <motion.div variants={fadeInUp} className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                🎯 Active Campaigns
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {launchedPosters.map((launch) => (
                  <motion.div
                    key={launch.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-md border-green-500/30 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">{launch.posterData?.title}</h3>
                        <div className="flex items-center gap-2">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-3 h-3 bg-green-500 rounded-full"
                          />
                          <span className="text-sm text-green-400 font-medium">Live</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4">
                        Launched: {new Date(launch.launchedAt).toLocaleDateString()}
                      </p>
                      
                      <Button
                        onClick={() => handleStopLaunch(launch.posterId)}
                        variant="outline"
                        className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        ⏹️ Stop Campaign
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Poster Display Modal */}
      <AnimatePresence>
        {showPosterDisplay && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPosterDisplay(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Spectacular Poster Display */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-30"
                      animate={{
                        x: [0, Math.random() * 400 - 200],
                        y: [0, Math.random() * 600 - 300],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      style={{
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                      }}
                    />
                  ))}
                </div>

                {/* Poster Image with Effects */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative z-10 mb-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <img 
                      src={selectedPoster.imageUrl} 
                      alt={selectedPoster.title}
                      className="w-full h-auto max-h-[60vh] object-contain bg-white/5 backdrop-blur-sm"
                    />
                    
                    {/* Glowing Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2"
                      animate={{
                        borderColor: [
                          'rgba(16, 185, 129, 0.5)',
                          'rgba(56, 178, 172, 0.8)',
                          'rgba(16, 185, 129, 0.5)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>

                {/* Launch Button */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleLaunchPoster}
                      disabled={launchLoading}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 text-xl shadow-2xl border-0 relative overflow-hidden"
                    >
                      {launchLoading ? (
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          />
                          Launching Magic...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            🚀
                          </motion.span>
                          Launch Poster
                        </div>
                      )}
                      
                      {/* Button Glow Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-xl"
                        animate={{
                          opacity: [0, 1, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPosterDisplay(false)}
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/20 transition-all duration-200"
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminPosterLaunch;

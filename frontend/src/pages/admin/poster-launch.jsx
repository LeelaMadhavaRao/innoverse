import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { adminAPI } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';
import LaunchSuccessModal from '../../components/launch-success-modal';
import { useBackgroundMusic } from '../../hooks/use-background-music';
import { MusicControls } from '../../components/music-controls';

function AdminPosterLaunch() {
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [launchPhase, setLaunchPhase] = useState('selection'); // 'selection', 'blur', 'launching', 'curtains', 'display', 'success'
  const [launchedPosters, setLaunchedPosters] = useState([]);
  const [localLaunchedPosters, setLocalLaunchedPosters] = useState(new Set()); // Track locally launched posters
  const { addToast: toast } = useToast();

  // Background music for poster launch
  const music = useBackgroundMusic('/innoverse.mp3', {
    autoPlay: false,
    loop: true,
    volume: 0.25,
    fadeInDuration: 2000,
    fadeOutDuration: 1500
  });

  // Poster data with actual images
  const posters = [
    {
      id: 'innoverse-2025',
      title: 'Innoverse Event',
      subtitle: 'Startup Innovation Contest',
      description: 'A premier startup contest where we dive deep into innovative ideas and entrepreneurial solutions',
      date: 'September 15, 2025',
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
      date: 'September 16, 2025',
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
    console.log('🎯 Selecting poster:', poster);
    
    // Check if poster has already been launched locally
    if (localLaunchedPosters.has(poster.id)) {
      // Instead of showing a toast, directly display the poster with effects
      console.log('📱 Poster already launched, showing display directly with effects');
      setSelectedPoster(poster);
      setLaunchPhase('display');
      return;
    }
    
    setSelectedPoster(poster);
    setLaunchPhase('blur');
    console.log('📱 Phase changed to blur');
  };

  const handleLaunchPoster = async () => {
    console.log('🚀 Launch button clicked, current phase:', launchPhase);
    console.log('📝 Selected poster:', selectedPoster);
    
    if (!selectedPoster || launchPhase !== 'blur') {
      console.log('❌ Launch prevented - poster:', !!selectedPoster, 'phase:', launchPhase);
      return;
    }

    const isPreview = isPosterLaunched(selectedPoster.id);
    console.log('👁️ Is Preview Mode:', isPreview);

    try {
      console.log('✅ Starting launch sequence...');
      
      // Start background music for Innoverse poster during launch OR preview
      if (selectedPoster.id === 'innoverse-2025' && music.isLoaded) {
        music.play();
        console.log('🎵 Background music started for Innoverse', isPreview ? 'preview' : 'launch');
      }
      
      setLaunchPhase('launching');
      console.log('📱 Phase changed to launching');
      
      // First phase: launching animation (2 seconds)
      console.log('⏱️ Starting 2-second launch animation...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✨ Launch animation complete');
      
      // Second phase: curtains opening effect (5 seconds - increased from 3)
      setLaunchPhase('curtains');
      console.log('🎭 Phase changed to curtains opening');
      console.log('⏱️ Starting 5-second curtains animation...');
      
      if (!isPreview) {
        // Only do API call for actual launch, not preview
        const launchData = {
          posterId: selectedPoster.id,
          posterData: selectedPoster,
          launchedAt: new Date().toISOString(),
          launchedBy: 'admin'
        };

        console.log('📡 Sending API request during curtains...');
        const apiPromise = adminAPI.launchPoster(launchData);
        
        // Wait for curtains animation to complete (increased time)
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('✨ Curtains animation complete');
        
        // Ensure API call is complete
        await apiPromise;
        console.log('✅ API request successful');
        
        // Add to locally launched posters
        setLocalLaunchedPosters(prev => new Set([...prev, selectedPoster.id]));
      } else {
        // For preview, just wait for curtains animation
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('✨ Curtains animation complete (Preview Mode)');
      }
      
      // Third phase: display final poster - wait for user to close
      setLaunchPhase('display');
      console.log('📱 Phase changed to display');
      
      if (!isPreview) {
        fetchLaunchedPosters();
      }
      
    } catch (error) {
      console.error('❌ Error launching poster:', error);
      toast({
        title: isPreview ? 'Preview Failed' : 'Launch Failed',
        description: isPreview ? 'Failed to preview poster. Please try again.' : 'Failed to launch poster. Please try again.',
        type: 'destructive',
      });
      resetToSelection();
    }
  };

  const resetToSelection = () => {
    setSelectedPoster(null);
    setLaunchPhase('selection');
    
    // Stop music when resetting
    if (music.isPlaying) {
      music.stop();
      console.log('🎵 Background music stopped on reset');
    }
  };

  // Helper function to check if poster is already launched
  const isPosterLaunched = (posterId) => {
    return localLaunchedPosters.has(posterId) || 
           launchedPosters.some(launch => launch.posterData?.id === posterId || launch.posterId === posterId);
  };

  // Helper function to get button text based on launch status
  const getActionButtonText = (poster) => {
    return isPosterLaunched(poster.id) ? '👁️ Preview Poster' : '🚀 Launch Poster';
  };

  const handleClosePosterDisplay = () => {
    console.log('✨ User closed poster display');
    
    // Stop music when user clicks Close & Continue
    if (music.isPlaying) {
      music.stop();
      console.log('🎵 Background music stopped on Close & Continue');
    }
    
    setLaunchPhase('success');
    console.log('📱 Phase changed to success');
  };

  const handleResetLaunch = (posterId) => {
    setLocalLaunchedPosters(prev => {
      const newSet = new Set(prev);
      newSet.delete(posterId);
      return newSet;
    });
    toast({
      title: 'Launch Reset',
      description: 'Poster can now be launched again.',
      type: 'success',
    });
  };

  const handleResetAllLaunches = async () => {
    try {
      console.log('🔄 Starting bulk reset of all poster launches...');
      
      // Call the bulk reset API
      const response = await adminAPI.resetAllPosterLaunches();
      
      console.log('✅ Bulk reset response:', response.data);
      
      // Reset local state
      setLocalLaunchedPosters(new Set());
      
      // Refresh the launched posters list to reflect changes
      await fetchLaunchedPosters();
      
      toast({
        title: 'All Launches Reset Successfully!',
        description: `${response.data.resetCount} poster(s) have been reset and removed from the home page.`,
        type: 'success',
      });
      
      console.log(`🎯 Reset complete: ${response.data.resetCount} posters reset`);
    } catch (error) {
      console.error('❌ Error resetting all launches:', error);
      toast({
        title: 'Reset Failed',
        description: error.response?.data?.message || 'Failed to reset poster launches. Please try again.',
        type: 'error',
      });
    }
  };

  const handleBackdropClick = () => {
    if (launchPhase === 'blur') {
      resetToSelection();
    }
    // Don't allow closing during launch sequence
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

  // Floating particles for background
  const floatingParticles = Array.from({ length: 15 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
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
      {/* Music Controls */}
      <MusicControls
        isPlaying={music.isPlaying}
        onPlay={music.play}
        onPause={music.pause}
        onStop={music.stop}
        volume={music.currentVolume}
        onVolumeChange={music.setVolume}
        isVisible={true}
        position="top-right"
      />

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
            
            {/* Reset All Launches Button */}
            {(localLaunchedPosters.size > 0 || launchedPosters.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Button
                  onClick={handleResetAllLaunches}
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 px-8 py-3"
                >
                  🔄 Reset All Launches ({Math.max(localLaunchedPosters.size, launchedPosters.length)})
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Only show poster selection when in 'selection' phase */}
          {launchPhase === 'selection' && (
            <>
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
                                localLaunchedPosters.has(poster.id)
                                  ? 'bg-green-600/20 text-green-400 border-green-500/30'
                                  : poster.theme === 'innovation' 
                                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' 
                                    : 'bg-purple-600/20 text-purple-400 border-purple-500/30'
                              }`}>
                                {localLaunchedPosters.has(poster.id) ? 'Launched' : poster.status}
                              </Badge>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="text-2xl"
                              >
                                {localLaunchedPosters.has(poster.id) ? '✅' : '🎯'}
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
                            {isPosterLaunched(poster.id) ? (
                              <Button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectPoster(poster); // Preview the poster
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                              >
                                �️ Preview Poster
                              </Button>
                            ) : (
                              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0">
                                🚀 Select & Launch
                              </Button>
                            )}
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
                    {launchedPosters.map((launch, index) => (
                      <motion.div
                        key={launch._id || launch.id || `launch-${index}`}
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
            </>
          )}
        </motion.div>
      </div>

      {/* Blurred Poster Modal with Launch Button */}
      <AnimatePresence>
        {(launchPhase === 'blur' || launchPhase === 'launching') && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Blurred Poster Background */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 shadow-2xl overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-20"
                      animate={{
                        x: [0, Math.random() * 300 - 150],
                        y: [0, Math.random() * 400 - 200],
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
                  ))}
                </div>

                {/* Blurred Poster Image */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10"
                >
                  <img 
                    src={selectedPoster.imageUrl} 
                    alt={selectedPoster.title}
                    className="w-full h-auto max-h-[70vh] object-contain bg-white/5 backdrop-blur-sm filter blur-md"
                  />
                  
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  
                  {/* Launch Button Overlay */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {launchPhase === 'launching' ? (
                      <motion.div
                        className="text-center relative w-full h-full"
                        animate={{
                          scale: [1, 1.02, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {/* Simple Launch Text with Loader */}
                        <div className="relative z-10 flex flex-col items-center justify-center min-h-[400px]">
                          
                          {/* Simple Decent Loader */}
                          <div className="mb-8">
                            <motion.div
                              className="w-16 h-16 border-4 border-gray-600 border-t-emerald-400 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                          
                          <motion.h2
                            className="text-6xl font-bold text-white mb-4 tracking-wide"
                            style={{
                              textShadow: '0 0 30px rgba(16, 185, 129, 0.8)',
                            }}
                            animate={{
                              opacity: [0.8, 1, 0.8],
                              scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            LAUNCHING
                          </motion.h2>
                          
                          <motion.p
                            className="text-xl text-emerald-400 font-medium"
                            animate={{
                              opacity: [0.6, 1, 0.6],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Igniting spectacular effects...
                          </motion.p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-center"
                      >
                        <Button
                          onClick={handleLaunchPoster}
                          disabled={launchPhase !== 'blur'}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-16 py-6 text-2xl shadow-2xl border-0 relative overflow-hidden"
                        >
                          <div className="flex items-center gap-4">
                            <motion.span
                              animate={{ 
                                scale: [1, 1.3, 1],
                                rotate: [0, 15, -15, 0]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-3xl"
                            >
                              {isPosterLaunched(selectedPoster?.id) ? '�️' : '�🚀'}
                            </motion.span>
                            {getActionButtonText(selectedPoster)}
                          </div>
                          
                          {/* Button Glow Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 blur-xl"
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          />
                        </Button>
                        
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="text-gray-300 mt-6 text-lg"
                        >
                          Click to launch "{selectedPoster.title}" with spectacular effects!
                        </motion.p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Close Button - Only show during blur phase */}
                {launchPhase === 'blur' && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetToSelection}
                    className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/20 transition-all duration-200 z-20"
                  >
                    ✕
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curtains Opening Effect */}
      <AnimatePresence>
        {launchPhase === 'curtains' && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Stage Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />
            
            {/* Spotlights */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-96 h-96 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.3, 0.1], 
                  scale: [0, 2, 1.5],
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                style={{
                  background: `radial-gradient(circle, ${i === 0 ? 'rgba(255,255,255,0.3)' : i === 1 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.15)'} 0%, transparent 70%)`,
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                }}
              />
            ))}

            {/* Left Curtain */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ 
                duration: 3, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.5
              }}
              className="absolute top-0 left-0 w-1/2 h-full z-20"
            >
              <div className="w-full h-full bg-gradient-to-r from-red-800 via-red-700 to-red-600 relative">
                {/* Curtain Folds */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-0 h-full w-2 bg-red-900/50"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: [1, 0.95, 1] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{ left: `${i * 12.5}%` }}
                  />
                ))}
                
                {/* Curtain Tassel */}
                <motion.div
                  className="absolute top-0 right-0 w-8 h-full bg-gradient-to-b from-yellow-600 to-yellow-800"
                  animate={{ 
                    rotateY: [0, 5, -5, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
              </div>
            </motion.div>

            {/* Right Curtain */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ 
                duration: 3, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.5
              }}
              className="absolute top-0 right-0 w-1/2 h-full z-20"
            >
              <div className="w-full h-full bg-gradient-to-l from-red-800 via-red-700 to-red-600 relative">
                {/* Curtain Folds */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-0 h-full w-2 bg-red-900/50"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: [1, 0.95, 1] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{ left: `${i * 12.5}%` }}
                  />
                ))}
                
                {/* Curtain Tassel */}
                <motion.div
                  className="absolute top-0 left-0 w-8 h-full bg-gradient-to-b from-yellow-600 to-yellow-800"
                  animate={{ 
                    rotateY: [0, -5, 5, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
              </div>
            </motion.div>

            {/* Center Stage with Poster Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 2,
                delay: 1.5,
                ease: "easeOut"
              }}
              className="relative z-10 max-w-2xl w-full"
            >
              {/* Stage Frame */}
              <div className="relative bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-yellow-600/20 rounded-3xl p-8 border-4 border-yellow-600/30">
                {/* Golden Sparkles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      delay: 1 + Math.random() * 2,
                      repeat: Infinity,
                    }}
                    style={{
                      left: Math.random() * 100 + '%',
                      top: Math.random() * 100 + '%',
                    }}
                  />
                ))}
                
                {/* Poster Preview */}
                <motion.img
                  src={selectedPoster.imageUrl}
                  alt={selectedPoster.title}
                  className="w-full h-auto max-h-[50vh] object-contain rounded-xl shadow-2xl"
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ 
                    duration: 1.5,
                    delay: 2,
                    ease: "easeOut"
                  }}
                />
                
                {/* Stage Lights Effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    background: [
                      'radial-gradient(circle at 50% 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)',
                      'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
                      'radial-gradient(circle at 50% 0%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)'
                    ]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity 
                  }}
                />
              </div>
              
              {/* Curtains Opening Text */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                className="text-center mt-6"
              >
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                  🚀 Poster Launching...
                </h2>
                <p className="text-white/80">
                  Preparing to showcase "{selectedPoster.title}"
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Poster Display Modal */}
      <AnimatePresence>
        {launchPhase === 'display' && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: -90, rotateY: 180 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateX: 90, rotateY: -180 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 20,
                duration: 1.5
              }}
              className="relative max-w-5xl w-full"
            >
              {/* Spectacular Final Display */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
                {/* Explosive Background Effects */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(40)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, Math.random() * 600 - 300],
                        y: [0, Math.random() * 800 - 400],
                      }}
                      transition={{
                        duration: Math.random() * 3 + 2,
                        delay: Math.random() * 1,
                        ease: "easeOut"
                      }}
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                    />
                  ))}
                </div>

                {/* Main Container with Flex Layout */}
                <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                  {/* Final Poster Image */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex-1"
                  >
                    <img 
                      src={selectedPoster.imageUrl} 
                      alt={selectedPoster.title}
                      className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                    />
                  </motion.div>

                  {/* Success Message Panel - Right Side */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:w-80 w-full bg-green-600/20 backdrop-blur-md rounded-xl p-6 text-center flex flex-col justify-center"
                  >
                    <h3 className="text-xl font-bold text-white mb-3">
                      {isPosterLaunched(selectedPoster.id) ? 
                        '👁️ Poster Preview Complete!' : 
                        '🎉 Poster Launched Successfully!'
                      }
                    </h3>
                    <p className="text-green-400 mb-6 text-sm">
                      {isPosterLaunched(selectedPoster.id) ? 
                        `"${selectedPoster.title}" preview completed successfully` :
                        `"${selectedPoster.title}" is now live and visible to all users`
                      }
                    </p>
                    
                    {/* Close Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClosePosterDisplay}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                    >
                      {isPosterLaunched(selectedPoster.id) ? 
                        '✨ Close Preview & Continue' : 
                        '✨ Save & Continue'
                      }
                    </motion.button>
                  </motion.div>
                </div>

                {/* Top Right Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClosePosterDisplay}
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white rounded-full p-3 hover:bg-white/20 transition-all duration-200 z-20"
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launch Success Modal */}
      <LaunchSuccessModal
        isVisible={launchPhase === 'success'}
        posterTitle={selectedPoster?.title}
        onClose={resetToSelection}
      />
    </div>
  );
}

export default AdminPosterLaunch;

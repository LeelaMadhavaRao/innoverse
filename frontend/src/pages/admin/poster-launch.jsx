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
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [launchPhase, setLaunchPhase] = useState('selection'); // 'selection', 'blur', 'launching', 'curtains', 'display', 'success'
  const [videoLaunchPhase, setVideoLaunchPhase] = useState('selection'); // 'selection', 'blur', 'launching', 'playing', 'success'
  const [launchedPosters, setLaunchedPosters] = useState([]);
  const [launchedVideos, setLaunchedVideos] = useState([]);
  const [localLaunchedPosters, setLocalLaunchedPosters] = useState(new Set()); // Track locally launched posters
  const [localLaunchedVideos, setLocalLaunchedVideos] = useState(new Set()); // Track locally launched videos
  const { addToast: toast } = useToast();

  // Separate music hooks for each poster type
  const innoverseMusic = useBackgroundMusic('/innoverse.mp3', {
    autoPlay: false,
    loop: true,
    volume: 1.0,
    fadeInDuration: 2000,
    fadeOutDuration: 1500
  });

  const potluckMusic = useBackgroundMusic('/potluck.mp3', {
    autoPlay: false,
    loop: true,
    volume: 1.0,
    fadeInDuration: 2000,
    fadeOutDuration: 1500
  });

  // Get the current music handler based on selected poster
  const getCurrentMusic = () => {
    if (!selectedPoster) return innoverseMusic;
    return selectedPoster.id === 'potluck-lunch-2025' ? potluckMusic : innoverseMusic;
  };

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

  // Promotion video data
  const promotionVideos = [
    {
      id: 'vikas-promotion-2025',
      title: 'Vikas Promotion Video',
      subtitle: 'Inspiring Success Story',
      description: 'An inspiring promotion video showcasing innovation and excellence',
      date: 'September 8, 2025',
      organizer: 'Marketing Team',
      videoUrl: '/vikas.mp4',
      thumbnailUrl: '/vikas-thumbnail.jpg', // We'll use a default if this doesn't exist
      duration: '2:30',
      status: 'ready',
      theme: 'promotion'
    }
  ];

  useEffect(() => {
    fetchLaunchedPosters();
    fetchLaunchedVideos();
  }, []);

  const fetchLaunchedPosters = async () => {
    try {
      const response = await adminAPI.getLaunchedPosters();
      setLaunchedPosters(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching launched posters:', error);
    }
  };

  const fetchLaunchedVideos = async () => {
    try {
      console.log('📡 Fetching launched videos from API...');
      const response = await adminAPI.getLaunchedVideos();
      console.log('✅ Launched videos response:', response.data);
      setLaunchedVideos(response.data || []);
      
      // Update local launched videos set for UI state
      const videoIds = response.data?.map(v => v.videoId) || [];
      setLocalLaunchedVideos(new Set(videoIds));
    } catch (error) {
      console.error('❌ Error fetching launched videos:', error);
      // Fallback to localStorage if API fails
      const savedVideos = localStorage.getItem('launchedVideos');
      if (savedVideos) {
        const videos = JSON.parse(savedVideos);
        setLaunchedVideos(videos);
        const videoIds = videos.map(v => v.videoId);
        setLocalLaunchedVideos(new Set(videoIds));
      }
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
      console.log('🎯 Selected Poster ID:', selectedPoster.id);
      
      // Get the appropriate music handler and start playing
      const music = getCurrentMusic();
      const musicType = selectedPoster.id === 'potluck-lunch-2025' ? 'Potluck' : 'Innoverse';
      
      console.log('🎵 Starting', musicType, 'music - isLoaded:', music.isLoaded);
      
      if (music.isLoaded) {
        music.play();
        console.log('🎵', musicType, 'background music started successfully');
      } else {
        console.log('⏳', musicType, 'music not loaded yet, will try again...');
        // Try again after a short delay
        setTimeout(() => {
          if (music.isLoaded) {
            music.play();
            console.log('🎵', musicType, 'background music started after delay');
          } else {
            console.error('❌', musicType, 'music failed to load');
          }
        }, 500);
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
    
    // Stop all music when resetting
    if (innoverseMusic.isPlaying) {
      innoverseMusic.stop();
      console.log('🎵 Innoverse background music stopped on reset');
    }
    if (potluckMusic.isPlaying) {
      potluckMusic.stop();
      console.log('🎵 Potluck background music stopped on reset');
    }
    
    // Also reset video state if needed
    if (selectedVideo) {
      resetVideoToSelection();
    }
    
    // Force UI refresh to ensure cards are visible
    setTimeout(() => {
      fetchLaunchedPosters();
      fetchLaunchedVideos();
    }, 100);
    
    console.log('🔄 Reset to selection mode with UI refresh');
  };

  // Helper function to check if poster is already launched
  const isPosterLaunched = (posterId) => {
    return localLaunchedPosters.has(posterId) || 
           launchedPosters.some(launch => launch.posterData?.id === posterId || launch.posterId === posterId);
  };

  // Helper function to check if video is already launched
  const isVideoLaunched = (videoId) => {
    return localLaunchedVideos.has(videoId) || 
           launchedVideos.some(launch => launch.videoData?.id === videoId || launch.videoId === videoId);
  };

  // Video handling functions
  const handleSelectVideo = (video) => {
    console.log('🎬 Selecting video:', video);
    
    // Check if video has already been launched locally
    if (localLaunchedVideos.has(video.id)) {
      console.log('📱 Video already launched, showing display directly with effects');
      setSelectedVideo(video);
      setVideoLaunchPhase('playing');
      return;
    }
    
    setSelectedVideo(video);
    setVideoLaunchPhase('blur');
    console.log('📱 Video phase changed to blur');
  };

  const handleLaunchVideo = async () => {
    console.log('🚀 Video launch button clicked, current phase:', videoLaunchPhase);
    console.log('📝 Selected video:', selectedVideo);
    
    if (!selectedVideo || videoLaunchPhase !== 'blur') {
      console.log('❌ Video launch prevented - video:', !!selectedVideo, 'phase:', videoLaunchPhase);
      return;
    }

    const isPreview = isVideoLaunched(selectedVideo.id);
    console.log('👁️ Is Video Preview Mode:', isPreview);

    try {
      console.log('✅ Starting video launch sequence...');
      
      setVideoLaunchPhase('launching');
      console.log('📱 Video phase changed to launching');
      
      // First phase: launching animation (2 seconds)
      console.log('⏱️ Starting 2-second video launch animation...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✨ Video launch animation complete');
      
      // Second phase: video playing effect (3 seconds)
      setVideoLaunchPhase('playing');
      console.log('🎬 Video phase changed to playing');
      console.log('⏱️ Starting 3-second video preview...');
      
      // Call API to launch video
      const videoLaunchData = {
        videoId: selectedVideo.id,
        videoData: selectedVideo,
        config: {
          scheduledTime: new Date(),
          displayDuration: 24,
          targetAudience: 'all',
          message: '',
          priority: 'medium',
          autoPlay: true,
          volume: 1.0
        }
      };

      const response = await adminAPI.launchVideo(videoLaunchData);
      console.log('✅ Video launch API response:', response.data);
      
      // Add to locally launched videos for immediate UI update
      setLocalLaunchedVideos(prev => new Set([...prev, selectedVideo.id]));
      
      // Refresh launched videos list
      await fetchLaunchedVideos();
      
      // Wait for video preview
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✨ Video preview complete');
      
      if (!isPreview) {
        fetchLaunchedVideos();
      }
      
    } catch (error) {
      console.error('❌ Error launching video:', error);
      toast({
        title: isPreview ? 'Video Preview Failed' : 'Video Launch Failed',
        description: isPreview ? 'Failed to preview video. Please try again.' : 'Failed to launch video. Please try again.',
        type: 'destructive',
      });
      resetVideoToSelection();
    }
  };

  const handleCloseVideoDisplay = async () => {
    console.log('✨ User clicked video Save & Continue button');
    
    setVideoLaunchPhase('success');
    console.log('📱 Video phase changed to success');
    
    // Refresh the launched videos data to update the UI
    await fetchLaunchedVideos();
    
    // Reset video selection to go back to selection mode and refresh UI
    setTimeout(() => {
      resetVideoToSelection();
      // Force a complete UI refresh by re-fetching all data
      fetchLaunchedPosters();
      fetchLaunchedVideos();
      // Also reset any poster selection state to ensure clean UI
      if (selectedPoster) {
        resetToSelection();
      }
    }, 2000); // Allow success animation to play first
  };

  const resetVideoToSelection = () => {
    setSelectedVideo(null);
    setVideoLaunchPhase('selection');
    console.log('🔄 Video selection reset to idle state');
  };

  // Helper function to get button text based on launch status
  const getActionButtonText = (poster) => {
    return isPosterLaunched(poster.id) ? '👁️ Preview Poster' : '🚀 Launch Poster';
  };

  // Helper function to get video button text based on launch status
  const getVideoActionButtonText = (video) => {
    return isVideoLaunched(video.id) ? '👁️ Preview Video' : '🎬 Launch Video';
  };

  const handleClosePosterDisplay = async () => {
    console.log('✨ User clicked Save & Continue button');
    
    const music = getCurrentMusic();
    const musicType = selectedPoster?.id === 'potluck-lunch-2025' ? 'Potluck' : 'Innoverse';
    
    console.log('🎵 Current music state - isPlaying:', music.isPlaying, 'type:', musicType);
    
    // Stop the appropriate music when user clicks Close & Continue
    if (music.isPlaying) {
      music.stop();
      console.log('🎵', musicType, 'background music stopped on Save & Continue button click');
    } else {
      console.log('🔇 No', musicType, 'music was playing when Save & Continue was clicked');
    }
    
    setLaunchPhase('success');
    console.log('📱 Phase changed to success');
    
    // Refresh the launched posters data to update the UI
    await fetchLaunchedPosters();
    
    // Reset poster selection to go back to selection mode
    setTimeout(() => {
      resetToSelection();
    }, 2000); // Allow success animation to play first
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
      console.log('🔄 Starting bulk reset of all poster and video launches...');
      
      // Stop poster music when resetting
      console.log('🎵 Stopping poster music during reset...');
      innoverseMusic.stop();
      potluckMusic.stop();
      
      // Call the combined reset API for both posters and videos
      const response = await adminAPI.resetAllLaunches();
      
      console.log('✅ Bulk reset response:', response.data);
      
      // Reset local state for both posters and videos
      setLocalLaunchedPosters(new Set());
      setLocalLaunchedVideos(new Set());
      
      // Clear localStorage fallback
      localStorage.removeItem('launchedVideos');
      
      // Refresh the launched lists to reflect changes
      await fetchLaunchedPosters();
      await fetchLaunchedVideos();
      
      toast({
        title: 'All Launches Reset Successfully!',
        description: `${response.data.resetCount.posters} poster(s) and ${response.data.resetCount.videos} video(s) have been reset.`,
        type: 'success',
      });
      
      console.log(`🎯 Reset complete: ${response.data.resetCount.total} total items reset`);
    } catch (error) {
      console.error('❌ Error resetting all launches:', error);
      toast({
        title: 'Reset Failed',
        description: error.response?.data?.message || 'Failed to reset launches. Please try again.',
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
        isPlaying={getCurrentMusic().isPlaying}
        onPlay={getCurrentMusic().play}
        onPause={getCurrentMusic().pause}
        onStop={getCurrentMusic().stop}
        volume={getCurrentMusic().currentVolume}
        onVolumeChange={getCurrentMusic().setVolume}
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
            {(localLaunchedPosters.size > 0 || launchedPosters.length > 0 || localLaunchedVideos.size > 0 || launchedVideos.length > 0) && (
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
                  🔄 Reset All Launches ({Math.max(localLaunchedPosters.size, launchedPosters.length) + Math.max(localLaunchedVideos.size, launchedVideos.length)})
                </Button>
              </motion.div>
            )}
            
            {/* Debug Music Test Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    console.log('🎵 Testing Potluck Music - isLoaded:', potluckMusic.isLoaded);
                    potluckMusic.play();
                  }}
                  variant="outline"
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10 px-6 py-2"
                >
                  🍽️ Test Potluck Music
                </Button>
                <Button
                  onClick={() => {
                    console.log('🎵 Testing Innoverse Music - isLoaded:', innoverseMusic.isLoaded);
                    innoverseMusic.play();
                  }}
                  variant="outline"
                  className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-6 py-2"
                >
                  🚀 Test Innoverse Music
                </Button>
                <Button
                  onClick={() => {
                    potluckMusic.stop();
                    innoverseMusic.stop();
                    console.log('🔇 All music stopped');
                  }}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-6 py-2"
                >
                  🔇 Stop All Music
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Only show poster selection when in 'selection' phase */}
          {launchPhase === 'selection' && videoLaunchPhase === 'selection' && (
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

              {/* Promotion Video Selection Cards */}
              <motion.div variants={fadeInUp} className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                  Select Promotion Video to Launch
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {promotionVideos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      variants={fadeInUp}
                      whileHover={{ 
                        scale: 1.05,
                        y: -10,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="group cursor-pointer"
                      onClick={() => handleSelectVideo(video)}
                    >
                      <Card className="relative h-80 bg-white/5 backdrop-blur-md border-white/10 overflow-hidden hover:border-purple-400/50 transition-all duration-300">
                        {/* Card Background - Video Thumbnail */}
                        <div className="absolute inset-0">
                          <video 
                            src={video.videoUrl} 
                            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                            muted
                            loop
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => e.target.pause()}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        </div>

                        {/* Card Content */}
                        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <Badge className={`${
                                localLaunchedVideos.has(video.id)
                                  ? 'bg-green-600/20 text-green-400 border-green-500/30'
                                  : video.theme === 'promotion' 
                                    ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' 
                                    : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                              }`}>
                                {localLaunchedVideos.has(video.id) ? 'Launched' : video.status}
                              </Badge>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="text-2xl"
                              >
                                {localLaunchedVideos.has(video.id) ? '✅' : '🎬'}
                              </motion.div>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                              {video.title}
                            </h3>
                            <p className="text-gray-300 mb-3 line-clamp-2">
                              {video.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <p className="text-purple-400 font-semibold">
                                {video.date}
                              </p>
                              <p className="text-sm text-gray-400">
                                Duration: {video.duration}
                              </p>
                            </div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            {isVideoLaunched(video.id) ? (
                              <Button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectVideo(video); // Preview the video
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                              >
                                👁️ Preview Video
                              </Button>
                            ) : (
                              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                                🎬 Select & Launch
                              </Button>
                            )}
                          </motion.div>
                        </div>

                        {/* Hover Effects */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        
                        {/* Play Icon Overlay */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-16 h-16 bg-purple-600/80 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl"
                          >
                            ▶️
                          </motion.div>
                        </motion.div>
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

              {/* Active Video Campaigns */}
              {launchedVideos.length > 0 && (
                <motion.div variants={fadeInUp} className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    🎬 Active Video Campaigns
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {launchedVideos.map((launch, index) => (
                      <motion.div
                        key={launch._id || launch.id || `video-launch-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group"
                      >
                        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-md border-purple-500/30 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">{launch.videoData?.title}</h3>
                            <div className="flex items-center gap-2">
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-3 h-3 bg-purple-500 rounded-full"
                              />
                              <span className="text-sm text-purple-400 font-medium">Playing</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-4">
                            Launched: {new Date(launch.launchedAt).toLocaleDateString()}
                          </p>
                          
                          <Button
                            onClick={() => {
                              // Remove from localStorage
                              const savedVideos = localStorage.getItem('launchedVideos') || '[]';
                              const videos = JSON.parse(savedVideos);
                              const filteredVideos = videos.filter(v => v.videoId !== launch.videoId);
                              localStorage.setItem('launchedVideos', JSON.stringify(filteredVideos));
                              
                              // Remove from local state
                              setLocalLaunchedVideos(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(launch.videoId);
                                return newSet;
                              });
                              
                              // Refresh list
                              fetchLaunchedVideos();
                              
                              toast({
                                title: 'Video Campaign Stopped',
                                description: `${launch.videoData?.title} has been stopped.`,
                                type: 'success',
                              });
                            }}
                            variant="outline"
                            className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            ⏹️ Stop Video
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

      {/* Video Launch Modals */}
      
      {/* Blurred Video Modal with Launch Button */}
      <AnimatePresence>
        {(videoLaunchPhase === 'blur' || videoLaunchPhase === 'launching') && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) resetVideoToSelection();
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Blurred Video Background */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 rounded-3xl p-8 shadow-2xl overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
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

                {/* Blurred Video Preview */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10"
                >
                  <video 
                    src={selectedVideo.videoUrl} 
                    className="w-full h-auto max-h-[70vh] object-contain bg-white/5 backdrop-blur-sm filter blur-md"
                    muted
                    loop
                    autoPlay
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
                    {videoLaunchPhase === 'launching' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-center"
                      >
                        <motion.div className="text-8xl mb-4">🎬</motion.div>
                        <motion.h2
                          className="text-6xl font-bold text-white mb-4 tracking-wide"
                          style={{
                            textShadow: '0 0 30px rgba(147, 51, 234, 0.8)',
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
                          className="text-xl text-purple-400 font-medium"
                          animate={{
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Preparing spectacular video effects...
                        </motion.p>
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-center"
                      >
                        <Button
                          onClick={handleLaunchVideo}
                          disabled={videoLaunchPhase !== 'blur'}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-16 py-6 text-2xl shadow-2xl border-0 relative overflow-hidden"
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
                              {isVideoLaunched(selectedVideo?.id) ? '👁️' : '🎬'}
                            </motion.span>
                            {getVideoActionButtonText(selectedVideo)}
                          </div>
                          
                          {/* Button Glow Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-xl"
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
                          Click to launch "{selectedVideo.title}" with spectacular effects!
                        </motion.p>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Close Button - Only show during blur phase */}
                {videoLaunchPhase === 'blur' && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetVideoToSelection}
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

      {/* Video Playing Effect */}
      <AnimatePresence>
        {videoLaunchPhase === 'playing' && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
            
            {/* Spotlight Effects */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-96 bg-gradient-to-b from-purple-400/30 to-transparent"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  rotate: [-10, 10, -10],
                  scaleY: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                }}
                style={{
                  left: `${20 + i * 15}%`,
                  top: '0%',
                  transformOrigin: 'top center'
                }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full"
            >
              {/* Video Display with Effects */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 rounded-3xl p-8 shadow-2xl">
                {/* Particle Effects */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  {[...Array(30)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, Math.random() * 600 - 300],
                        y: [0, Math.random() * 800 - 400],
                      }}
                      transition={{
                        duration: 4,
                        delay: Math.random() * 2,
                        repeat: Infinity,
                      }}
                      style={{
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                      }}
                    />
                  ))}
                </div>

                {/* Video Preview */}
                <motion.video
                  src={selectedVideo.videoUrl}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-2xl"
                  autoPlay
                  controls
                  loop
                  initial={{ rotateY: -90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ 
                    duration: 1.5,
                    delay: 1,
                    ease: "easeOut"
                  }}
                />

                {/* Video Title Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                  className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-4"
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h3>
                  <p className="text-purple-300">{selectedVideo.subtitle}</p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex justify-center mt-8 gap-4">
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseVideoDisplay}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
                  >
                    {isVideoLaunched(selectedVideo.id) ? 
                      '✨ Close Preview & Continue' : 
                      '✨ Save & Continue'
                    }
                  </motion.button>
                </div>

                {/* Top Right Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseVideoDisplay}
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

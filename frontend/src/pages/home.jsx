import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/auth-context';
import { useBackgroundMusic } from '../hooks/use-background-music';
import { MusicControls } from '../components/music-controls';
import Navigation from '../components/navigation';
import { posterLaunchAPI } from '../lib/api';
import FacultyInvitation from '../components/invitation/FacultyInvitation';

function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [launchedPosters, setLaunchedPosters] = useState([]);
  const [launchedVideos, setLaunchedVideos] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewedPosters, setViewedPosters] = useState(new Set()); // Track viewed posters by IP
  const [showFacultyInvitation, setShowFacultyInvitation] = useState(false);
  const [facultyData, setFacultyData] = useState(null);

  // Background music for poster viewing
  const innoverseMusic = useBackgroundMusic('/innoverse.mp3', {
    autoPlay: false,
    loop: true,
    volume: 1.0,
    fadeInDuration: 2000,
    fadeOutDuration: 1000
  });

  // Background music for potluck poster viewing
  const potluckMusic = useBackgroundMusic('/potluck.mp3', {
    autoPlay: false,
    loop: true,
    volume: 1.0,
    fadeInDuration: 2000,
    fadeOutDuration: 1000
  });

  // Refs for sections
  const homeRef = useRef(null);
  const postersRef = useRef(null);
  const eventDetailsRef = useRef(null);
  const teamStructureRef = useRef(null);
  const evaluationRef = useRef(null);

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

  useEffect(() => {
    // Fetch events data with proper API client
    const fetchEvents = async () => {
      try {
        console.log('🔄 Fetching events...');
        const response = await posterLaunchAPI.getEvents();
        const data = response.data;
        setEvents(Array.isArray(data) ? data : []);
        console.log('✅ Events fetched successfully:', data.length || 0, 'events');
      } catch (error) {
        console.warn('⚠️ Backend not available for events, using fallback data:', error.message);
        setEvents([]);
      }
    };

    // Fetch launched posters with proper API client
    const fetchLaunchedPosters = async () => {
      try {
        console.log('🔄 Fetching launched posters...');
        const response = await posterLaunchAPI.getPublicLaunchedPosters();
        const data = response.data;
        
        if (data.success && Array.isArray(data.data)) {
          setLaunchedPosters(data.data);
          console.log('✅ Posters fetched successfully:', data.data.length, 'posters');
        } else {
          setLaunchedPosters([]);
          console.log('✅ No posters available');
        }
      } catch (error) {
        console.warn('⚠️ Backend not available for posters, using fallback data:', error.message);
        setLaunchedPosters([]);
      }
    };

    // Fetch launched videos with proper API client
    const fetchLaunchedVideos = async () => {
      try {
        console.log('🔄 Fetching launched videos...');
        const response = await posterLaunchAPI.getPublicLaunchedVideos();
        const data = response.data;
        
        if (data.success && Array.isArray(data.data)) {
          setLaunchedVideos(data.data);
          console.log('✅ Videos fetched successfully:', data.data.length, 'videos');
        } else {
          setLaunchedVideos([]);
          console.log('✅ No videos available');
        }
      } catch (error) {
        console.warn('⚠️ Backend not available for videos, using fallback data:', error.message);
        setLaunchedVideos([]);
      }
    };

    // Fetch all data with better logging
    console.log('🚀 Initializing home page data fetch...');
    fetchEvents();
    fetchLaunchedPosters();
    fetchLaunchedVideos();
  }, []);

  // Faculty invitation logic
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const showInvitation = urlParams.get('showInvitation');
    const facultyInvitationFlag = localStorage.getItem('showFacultyInvitation');
    
    if (user && user.role === 'faculty' && (showInvitation === 'true' || facultyInvitationFlag === 'true')) {
      setFacultyData({
        name: user.name || 'Faculty Member',
        email: user.email || 'faculty@example.com',
        department: user.department || 'Computer Science',
        designation: user.designation || 'Assistant Professor',
        specialization: user.specialization || 'Software Engineering'
      });
      setShowFacultyInvitation(true);
      
      // Clear the invitation flag
      localStorage.removeItem('showFacultyInvitation');
      
      // Clean up URL
      if (showInvitation === 'true') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [user, location.search]);

  const handleFacultyInvitationComplete = () => {
    setShowFacultyInvitation(false);
  };

  const scrollToSection = (sectionRef, sectionName) => {
    setActiveSection(sectionName);
    sectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const getStartedLink = () => {
    if (!isAuthenticated) return '/login';
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'team':
        return '/team';
      case 'faculty':
        return '/faculty';
      case 'evaluator':
        return '/evaluator';
      default:
        return '/gallery';
    }
  };

  const handlePosterView = async (posterId) => {
    // Only increment view count once per IP address
    if (viewedPosters.has(posterId)) {
      console.log('📊 Poster already viewed from this IP, skipping count increment');
      return;
    }

    try {
      console.log('📈 Tracking poster view for:', posterId);
      await posterLaunchAPI.incrementPosterView(posterId);
      
      // Mark this poster as viewed from this IP
      setViewedPosters(prev => new Set([...prev, posterId]));
      
      // Update local state to reflect view count
      setLaunchedPosters(prev => 
        prev.map(poster => 
          poster.posterId === posterId 
            ? { ...poster, analytics: { ...poster.analytics, views: (poster.analytics?.views || 0) + 1 } }
            : poster
        )
      );
      
      console.log('✅ View count incremented for poster:', posterId);
    } catch (error) {
      console.warn('⚠️ Error tracking poster view (non-critical):', error.message);
    }
  };

  const handleViewPoster = (poster) => {
    setSelectedPoster(poster);
    setShowPosterModal(true);
    
    // Start appropriate music based on poster type
    if (poster.posterId === 'innoverse-2025' && innoverseMusic.isLoaded) {
      console.log('🎵 Starting Innoverse music for poster view');
      innoverseMusic.play();
    } else if (poster.posterId === 'potluck-lunch-2025' && potluckMusic.isLoaded) {
      console.log('🎵 Starting Potluck music for poster view');
      potluckMusic.play();
    }
    
    // Track view count
    handlePosterView(poster.posterId);
  };

  const handleViewVideo = async (video) => {
    // Track view count for video
    try {
      console.log('📈 Tracking video view for:', video.videoId);
      await posterLaunchAPI.incrementVideoView(video.videoId);
      
      // Update local state to reflect view count
      setLaunchedVideos(prev => 
        prev.map(v => 
          v.videoId === video.videoId 
            ? { ...v, analytics: { ...v.analytics, views: (v.analytics?.views || 0) + 1 } }
            : v
        )
      );
      console.log('✅ Video view count incremented for:', video.videoId);
    } catch (error) {
      console.warn('⚠️ Error tracking video view (non-critical):', error.message);
    }

    // Show video in full-screen modal
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const handleViewDetails = (poster) => {
    setSelectedPoster(poster);
    setShowDetailsModal(true);
  };

  const handleClosePosterModal = () => {
    setShowPosterModal(false);
    setSelectedPoster(null);
    
    // Stop music when closing poster
    if (innoverseMusic.isPlaying) {
      console.log('🛑 Stopping Innoverse music');
      innoverseMusic.stop();
    }
    if (potluckMusic.isPlaying) {
      console.log('🛑 Stopping Potluck music');
      potluckMusic.stop();
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedPoster(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Universal Navigation */}
      <Navigation />
      {/* Hero Section */}
      <section ref={homeRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-cyan-900/30"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
        
        {/* Hero Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="mb-8">
            <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 mb-6 px-4 py-2 text-lg">
              September 15-16, 2025
            </Badge>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Innoverse
            </span>
            <br />
            <TypeAnimation
              sequence={[
                'Startup Showcase',
                2000,
                'Innovation Hub',
                2000,
                'Future Builders',
                2000,
              ]}
              wrapper="span"
              speed={50}
              className="text-white"
              repeat={Infinity}
            />
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-300"
          >
            Where innovative startup ideas come to life! Present your solutions with PPT, 
            Lean Canvas models, and prototypes. Compete for glory and recognition in our 
            premier entrepreneurship event.
          </motion.p>

          {/* Role-specific Welcome Message */}
          {isAuthenticated && user && (
            <motion.div
              variants={fadeInUp}
              className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-purple-500/20 max-w-2xl mx-auto"
            >
              <h3 className="text-2xl font-semibold mb-2 text-purple-400">
                Welcome back, {user.name}! 👋
              </h3>
              <p className="text-gray-300">
                {user.role === 'admin' && "Manage the platform and launch exciting poster campaigns."}
                {user.role === 'team' && "Submit your innovative ideas and track your progress."}
                {user.role === 'evaluator' && "Evaluate teams and contribute to their success."}
                {user.role === 'faculty' && "Guide and mentor the next generation of innovators."}
              </p>
            </motion.div>
          )}
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            {!isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    onClick={() => scrollToSection(eventDetailsRef, 'event-details')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 text-xl shadow-2xl"
                  >
                    🚀 Explore Event
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    onClick={() => scrollToSection(evaluationRef, 'evaluation')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 text-xl shadow-2xl"
                  >
                    ⭐ Evaluation Criteria
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/gallery">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10 px-10 py-4 text-xl backdrop-blur-sm"
                    >
                      🖼️ View Gallery
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 text-xl shadow-2xl"
                    >
                      🔐 Get Started
                    </Button>
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to={getStartedLink()}>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 text-xl shadow-2xl"
                    >
                      📊 {user.role === 'admin' ? 'Admin Dashboard' : 
                           user.role === 'team' ? 'Team Dashboard' : 
                           user.role === 'evaluator' ? 'Evaluator Portal' : 
                           'Faculty Portal'}
                    </Button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    onClick={() => scrollToSection(evaluationRef, 'evaluation')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-4 text-xl shadow-2xl"
                  >
                    ⭐ Evaluation Criteria
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/gallery">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10 px-10 py-4 text-xl backdrop-blur-sm"
                    >
                      🖼️ View Gallery
                    </Button>
                  </Link>
                </motion.div>
                {user.role === 'admin' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/admin/poster-launch">
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-10 py-4 text-xl shadow-2xl"
                      >
                        🚀 Launch Posters
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>

          {/* Floating Stats */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {[
              { number: "10", label: "Teams", icon: "👥" },
              { number: "2", label: "Days", icon: "📅" },
              { number: "3", label: "Evaluators", icon: "🏆" },
              { number: "₹50K", label: "Momentum Distribution", icon: "💰" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.1, rotateY: 10 }}
                className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-emerald-400 mb-1">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Launched Posters Section */}
      {launchedPosters.length > 0 && (
        <section ref={postersRef} className="py-20 bg-gradient-to-br from-gray-800 via-slate-900 to-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🚀 Launched Posters
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Discover the exciting events and announcements that are currently live
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {launchedPosters.map((poster, index) => (
                <motion.div
                  key={poster._id || poster.posterId}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-purple-500/50">
                    {/* Poster Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={poster.imageUrl || '/placeholder.jpg'} 
                        alt={poster.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                      
                      {/* View Count Badge */}
                      <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-600">
                        <div className="flex items-center space-x-1 text-sm text-gray-300">
                          <span>👁️</span>
                          <span>{poster.analytics?.views || 0}</span>
                        </div>
                      </div>

                      {/* Live Badge */}
                      <div className="absolute top-4 left-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full border border-red-500"
                        >
                          <div className="flex items-center space-x-1 text-sm text-white">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span>LIVE</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Poster Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {poster.title}
                      </h3>
                      <p className="text-gray-400 mb-3 line-clamp-2">
                        {poster.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                          {poster.organizer}
                        </span>
                        <span className="text-sm text-purple-400">
                          {new Date(poster.launchedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewDetails(poster)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                        >
                          📋 View Details
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewPoster(poster)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                        >
                          🚀 View Poster
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Launched Videos Section */}
      {launchedVideos.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                🎬 Live Promotion Videos
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Watch our latest promotion videos showcasing amazing achievements and stories
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {launchedVideos.map((video, index) => (
                <motion.div
                  key={video._id || video.videoId}
                  variants={fadeInUp}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-lg rounded-3xl border border-purple-700/50 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-purple-400/70">
                    {/* Video Preview */}
                    <div className="relative h-48 overflow-hidden">
                      <video 
                        src={video.videoUrl} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        muted
                        poster={video.thumbnailUrl}
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => e.target.pause()}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="bg-purple-600/80 backdrop-blur-sm rounded-full p-4 shadow-lg border border-purple-400/50"
                        >
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </motion.div>
                      </div>

                      {/* View Count Badge */}
                      <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-600">
                        <div className="flex items-center space-x-1 text-sm text-gray-300">
                          <span>👁️</span>
                          <span>{video.analytics?.views || 0}</span>
                        </div>
                      </div>

                      {/* Live Badge */}
                      <div className="absolute top-4 left-4">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="bg-purple-600/90 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-500"
                        >
                          <div className="flex items-center space-x-1 text-sm text-white">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span>LIVE</span>
                          </div>
                        </motion.div>
                      </div>

                      {/* Duration Badge */}
                      {video.duration && (
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-gray-600">
                          <span className="text-sm text-white">{video.duration}</span>
                        </div>
                      )}
                    </div>

                    {/* Video Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center space-x-1">
                          <span>📅</span>
                          <span>{video.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>👥</span>
                          <span>{video.organizer}</span>
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewVideo(video)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                        >
                          🎬 Watch Video
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Event Details Section */}
      <section ref={eventDetailsRef} className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">`
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Event Details
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Two days of innovation, competition, and networking
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Day 1 - Innoverse */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-8 rounded-3xl border border-emerald-500/20 backdrop-blur-sm"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-emerald-400">Day 1 - Innoverse</h3>
                  <p className="text-gray-400">September 15, 2025</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">Startup Pitch Competition</p>
                    <p className="text-gray-400">Teams present their innovative startup ideas</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">PPT Presentations</p>
                    <p className="text-gray-400">Comprehensive business presentations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">Lean Canvas Models</p>
                    <p className="text-gray-400">Business model demonstration</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">Prototype Showcase</p>
                    <p className="text-gray-400">Live demonstration of working prototypes</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Day 2 - Potluck */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-8 rounded-3xl border border-orange-500/20 backdrop-blur-sm"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-orange-400">Day 2 - Potluck Lunch</h3>
                  <p className="text-gray-400">September 16, 2025</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-orange-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">Community Celebration</p>
                    <p className="text-gray-400">Celebrate innovation with the community</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-orange-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">Networking Session</p>
                    <p className="text-gray-400">Connect with fellow innovators</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-orange-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">Awards Ceremony</p>
                    <p className="text-gray-400">Recognition for outstanding teams</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-orange-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <p className="font-semibold text-white">Cultural Activities</p>
                    <p className="text-gray-400">Food, fun, and celebrations</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Evaluation Criteria Section */}
      <section id="evaluation" ref={evaluationRef} className="py-20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Evaluation Criteria
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              How your startup ideas will be judged and scored by our expert panel
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Problem Statement",
                description: "How well-defined and impactful is the problem you're solving?",
                icon: "🎯",
                color: "from-red-500 to-pink-600",
                bgColor: "from-red-900/30 to-pink-900/30",
                borderColor: "border-red-500/20"
              },
              {
                title: "Team Involvement",
                description: "How effectively is every team member contributing to the solution?",
                icon: "🤝",
                color: "from-blue-500 to-purple-600",
                bgColor: "from-blue-900/30 to-purple-900/30",
                borderColor: "border-blue-500/20"
              },
              {
                title: "Lean Canvas Model",
                description: "How comprehensive and realistic is your business model canvas?",
                icon: "📊",
                color: "from-emerald-500 to-teal-600",
                bgColor: "from-emerald-900/30 to-teal-900/30",
                borderColor: "border-emerald-500/20"
              },
              {
                title: "Prototype Quality",
                description: "How functional and innovative is your working prototype?",
                icon: "⚙️",
                color: "from-orange-500 to-yellow-600",
                bgColor: "from-orange-900/30 to-yellow-900/30",
                borderColor: "border-orange-500/20"
              }
            ].map((criteria, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                className={`bg-gradient-to-br ${criteria.bgColor} p-8 rounded-3xl border ${criteria.borderColor} backdrop-blur-sm text-center`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${criteria.color} rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-2xl`}>
                  {criteria.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{criteria.title}</h3>
                <p className="text-gray-300 leading-relaxed">{criteria.description}</p>
                
                {/* Score indicator */}
                <div className="mt-6 p-4 bg-black/20 rounded-2xl">
                  <div className="text-sm text-gray-400 mb-2">Max Score</div>
                  <div className="text-3xl font-bold text-emerald-400">25</div>
                  <div className="text-sm text-gray-400">Points</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scoring Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-3xl border border-purple-500/20 backdrop-blur-sm"
          >
            <h3 className="text-3xl font-bold text-center text-purple-400 mb-8">Scoring System</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Total Score Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                    <span className="text-gray-300">Problem Statement</span>
                    <span className="text-emerald-400 font-bold">25 points</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                    <span className="text-gray-300">Team Involvement</span>
                    <span className="text-emerald-400 font-bold">25 points</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                    <span className="text-gray-300">Lean Canvas Model</span>
                    <span className="text-emerald-400 font-bold">25 points</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                    <span className="text-gray-300">Prototype Quality</span>
                    <span className="text-emerald-400 font-bold">25 points</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl">
                      <span className="text-white font-bold">Total Maximum</span>
                      <span className="text-emerald-400 font-bold text-xl">100 points</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-white mb-4">Recognition Levels</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 rounded-xl">
                    <span className="text-3xl mr-3">🥇</span>
                    <div>
                      <div className="text-yellow-400 font-bold">1st Place</div>
                      <div className="text-gray-400 text-sm">90+ points</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-xl">
                    <span className="text-3xl mr-3">🥈</span>
                    <div>
                      <div className="text-gray-300 font-bold">2nd Place</div>
                      <div className="text-gray-400 text-sm">80+ points</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gradient-to-r from-orange-600/20 to-orange-500/20 rounded-xl">
                    <span className="text-3xl mr-3">🥉</span>
                    <div>
                      <div className="text-orange-400 font-bold">3rd Place</div>
                      <div className="text-gray-400 text-sm">70+ points</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl">
                    <span className="text-3xl mr-3">🏆</span>
                    <div>
                      <div className="text-emerald-400 font-bold">Special Recognition</div>
                      <div className="text-gray-400 text-sm">Outstanding categories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Structure Section - Will update with real names */}
      <section ref={teamStructureRef} className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Team Structure
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Meet the dedicated team organizing this exceptional event
            </p>
          </motion.div>

          {/* Head of Department */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-3xl font-bold text-purple-400">Head of Department</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Dr. N Gopi Krishna Murthy", designation: "HOD, CSIT" },
                { name: "Dr. M Suresh Babu", designation: "HOD, CSD" }
              ].map((hod, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-8 rounded-3xl border border-purple-500/20 text-center backdrop-blur-sm"
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">👑</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-white mb-3">{hod.name}</h4>
                  <p className="text-purple-400 mb-4 text-lg">{hod.designation}</p>
                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 text-sm">
                    Head of Department
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Faculty Advisors */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-3xl font-bold text-blue-400">Faculty Advisors</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Mr. N Praveen", designation: "Assistant Professor" },
                { name: "Mr. P Manoj", designation: "Assistant Professor" },
                { name: "Mr. S Mohan Krishna", designation: "Assistant Professor" },
                { name: "Mr. P S V Surya Kumar", designation: "Assistant Professor" },
              ].map((faculty, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-3xl border border-blue-500/20 text-center backdrop-blur-sm"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">👨‍🏫</span>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{faculty.name}</h4>
                  <p className="text-blue-400 mb-2">{faculty.designation}</p>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                    Faculty Advisor
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Student Coordinators */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-3xl font-bold text-emerald-400">Student Coordinators</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Ch Sai Vikas", year: "3/4 CSIT" },
                { name: "Divya Jyothika", year: "3/4 CSIT" },
                { name: "B Jnanendra Varma", year: "3/4 CSIT" },
                { name: "Lakshmi Prasanna Yatham", year: "3/4 CSIT" },
                { name: "Santosh Seelaboina", year: "3/4 CSIT" },
                { name: "B Manogna Nagavalli", year: "3/4 CSIT" },
                { name: "Leela Madhava Rao Nulakani", year: "3/4 CSIT" },
                { name: "Ch Bhanu Venkata Manikanta", year: "3/4 CSIT" }
              ].map((student, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 p-6 rounded-3xl border border-emerald-500/20 text-center backdrop-blur-sm"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">🎓</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{student.name}</h4>
                  <p className="text-emerald-400 mb-2">{student.year}</p>
                  <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 text-xs">
                    Student Coordinator
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Evaluators Section - Dynamic */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-3xl font-bold text-orange-400">Evaluators</h3>
            </div>
            
            <div className="text-center p-12 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-3xl border border-orange-500/20 backdrop-blur-sm">
              <div className="text-6xl mb-4">🔒</div>
              <h4 className="text-2xl font-bold text-orange-400 mb-4">Evaluators Panel</h4>
              <p className="text-gray-400 text-lg">
                Evaluators will be revealed once admin creates their credentials. 
                Stay tuned for our expert panel announcement!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
        >
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Innovate?</h2>
          <p className="text-2xl text-emerald-100 mb-12">
            Join Innoverse 2025 and showcase your startup idea to the world!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login">
                <Button 
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-gray-100 px-12 py-4 text-xl font-semibold shadow-2xl"
                >
                  Team Login
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                onClick={() => scrollToSection(evaluationRef, 'evaluation')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-xl font-semibold shadow-2xl"
              >
                ⭐ Evaluation Criteria
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/gallery">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-emerald-700 px-12 py-4 text-xl font-semibold"
                >
                  View Gallery
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Innoverse 2025
                </span>
              </div>
              <p className="text-gray-400">
                Where innovation meets opportunity. Join us for an extraordinary startup showcase event.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Event Information</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <span className="mr-2">📅</span>
                  <span>September 15-16, 2025</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>University Main Campus</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🎯</span>
                  <span>Startup Competition</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <button onClick={() => scrollToSection(eventDetailsRef, 'event-details')} className="block hover:text-emerald-400 transition-colors">
                  Event Details
                </button>
                <button onClick={() => scrollToSection(teamStructureRef, 'team-structure')} className="block hover:text-emerald-400 transition-colors">
                  Team Structure
                </button>
                <button onClick={() => scrollToSection(evaluationRef, 'evaluation')} className="block hover:text-emerald-400 transition-colors">
                  Evaluation Criteria
                </button>
                <Link to="/gallery" className="block hover:text-emerald-400 transition-colors">
                  Gallery
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span>innoverse@university.edu</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🌐</span>
                  <span>www.innoverse2025.com</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Innoverse. All rights reserved. Made with ❤️ for innovation.</p>
          </div>
        </div>
      </footer>

      {/* Poster Modal */}
      <AnimatePresence>
        {showPosterModal && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Music Controls */}
            <MusicControls
              isPlaying={
                selectedPoster.posterId === 'innoverse-2025' 
                  ? innoverseMusic.isPlaying 
                  : potluckMusic.isPlaying
              }
              onPlay={
                selectedPoster.posterId === 'innoverse-2025' 
                  ? innoverseMusic.play 
                  : potluckMusic.play
              }
              onPause={
                selectedPoster.posterId === 'innoverse-2025' 
                  ? innoverseMusic.pause 
                  : potluckMusic.pause
              }
              onStop={
                selectedPoster.posterId === 'innoverse-2025' 
                  ? innoverseMusic.stop 
                  : potluckMusic.stop
              }
              volume={
                selectedPoster.posterId === 'innoverse-2025' 
                  ? innoverseMusic.currentVolume 
                  : potluckMusic.currentVolume
              }
              onVolumeChange={
                selectedPoster.posterId === 'innoverse-2025' 
                  ? innoverseMusic.setVolume 
                  : potluckMusic.setVolume
              }
              isVisible={true}
              position="top-left"
            />

            {/* Poster Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-3xl border border-gray-700/50 overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClosePosterModal}
                className="absolute top-4 right-4 bg-red-600/80 backdrop-blur-sm text-white rounded-full p-3 hover:bg-red-700/80 transition-all duration-200 z-20"
              >
                ✕
              </motion.button>

              {/* Poster Content */}
              <div className="p-8 text-center">
                {/* Header */}
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedPoster.title}
                  </h1>
                  <p className="text-xl text-gray-400">{selectedPoster.subtitle}</p>
                </motion.div>

                {/* Poster Image */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <img 
                    src={selectedPoster.imageUrl || '/placeholder.jpg'} 
                    alt={selectedPoster.title}
                    className="w-full max-h-[60vh] object-contain mx-auto rounded-2xl shadow-2xl"
                  />
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-6"
                >
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    {selectedPoster.description}
                  </p>
                </motion.div>

                {/* Event Info */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-4 mb-8"
                >
                  <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-600">
                    <span className="text-purple-400 font-semibold">📅 {selectedPoster.date}</span>
                  </div>
                  <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-600">
                    <span className="text-purple-400 font-semibold">🏢 {selectedPoster.organizer}</span>
                  </div>
                  <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-600">
                    <span className="text-purple-400 font-semibold">👁️ {selectedPoster.analytics?.views || 0} views</span>
                  </div>
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClosePosterModal}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300"
                >
                  ✨ Close & Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCloseVideoModal}
              className="absolute top-6 right-6 z-60 bg-white/10 backdrop-blur-sm text-white rounded-full p-3 hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-md rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10" />
              
              {/* Particle Effects */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, Math.random() * 400 - 200],
                      y: [0, Math.random() * 300 - 150],
                    }}
                    transition={{
                      duration: 3,
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

              {/* Video Player */}
              <div className="relative z-10 p-6">
                <motion.video
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  src={selectedVideo.videoUrl}
                  className="w-full h-auto max-h-[70vh] rounded-2xl shadow-2xl"
                  controls
                  autoPlay
                  poster={selectedVideo.thumbnailUrl}
                />

                {/* Video Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-lg text-purple-300 mb-3">
                    {selectedVideo.subtitle}
                  </p>
                  <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
                    {selectedVideo.description}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <span>📅</span>
                      <span>{selectedVideo.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>👥</span>
                      <span>{selectedVideo.organizer}</span>
                    </span>
                    {selectedVideo.duration && (
                      <span className="flex items-center space-x-1">
                        <span>⏱️</span>
                        <span>{selectedVideo.duration}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <span>👁️</span>
                      <span>{selectedVideo.analytics?.views || 0} views</span>
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Close Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-6 text-center border-t border-purple-500/20"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseVideoModal}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 shadow-lg"
                >
                  ✨ Close Video
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPoster && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[80vh] bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseDetailsModal}
                className="absolute top-4 right-4 bg-gray-700/80 backdrop-blur-sm text-white rounded-full p-2 hover:bg-gray-600/80 transition-all duration-200 z-20"
              >
                ✕
              </motion.button>

              {/* Details Content */}
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6 pr-12">
                  📋 {selectedPoster.title} Details
                </h2>

                <div className="space-y-6 text-gray-300">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <h3 className="text-purple-400 font-semibold mb-2">📅 Event Date</h3>
                      <p>{selectedPoster.date}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <h3 className="text-purple-400 font-semibold mb-2">🏢 Organizer</h3>
                      <p>{selectedPoster.organizer}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-purple-400 font-semibold mb-2">📝 Description</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedPoster.description}</p>
                  </div>

                  {/* Analytics */}
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-purple-400 font-semibold mb-2">📊 Analytics</h3>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">👁️</span>
                        <span>{selectedPoster.analytics?.views || 0} views</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">📅</span>
                        <span>Launched {new Date(selectedPoster.launchedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h3 className="text-purple-400 font-semibold mb-2">🔥 Status</h3>
                    <div className="flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></span>
                      <span className="text-green-400 font-semibold">LIVE</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleCloseDetailsModal();
                      handleViewPoster(selectedPoster);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    🚀 View Poster
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCloseDetailsModal}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Faculty Invitation Modal */}
      <AnimatePresence>
        {showFacultyInvitation && facultyData && (
          <FacultyInvitation
            facultyData={facultyData}
            onComplete={handleFacultyInvitationComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;

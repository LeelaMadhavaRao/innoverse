import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/auth-context';
import { useBackgroundMusic } from '../hooks/use-background-music';
import { MusicControls } from '../components/music-controls';
import Navigation from '../components/navigation';

function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [launchedPosters, setLaunchedPosters] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewedPosters, setViewedPosters] = useState(new Set()); // Track viewed posters by IP

  // Background music for poster viewing
  const music = useBackgroundMusic('/innoverse.mp3', {
    autoPlay: false,
    loop: true,
    volume: 0.3,
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
    // Fetch events data
    const fetchEvents = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://innoverse-sigma.vercel.app/api';
        console.log('Fetching events from:', `${apiBaseUrl}/poster-launch/events`);
        
        const response = await fetch(`${apiBaseUrl}/poster-launch/events`);
        console.log('Events response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Events data:', data);
        
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Set default events on error
        setEvents([
          {
            id: 1,
            title: 'Event Information Loading',
            date: new Date().toISOString(),
            description: 'Event details will be updated soon'
          }
        ]);
      }
    };

    // Fetch launched posters
    const fetchLaunchedPosters = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://innoverse-sigma.vercel.app/api';
        console.log('Fetching from:', `${apiBaseUrl}/poster-launch/public/launched`);
        
        const response = await fetch(`${apiBaseUrl}/poster-launch/public/launched`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.success && data.data) {
          setLaunchedPosters(data.data);
        } else {
          // If no posters are available, show sample/demo posters
          setLaunchedPosters([
            {
              posterId: 'demo-1',
              title: 'Welcome to Innoverse 2025',
              subtitle: 'Innovation Awaits',
              description: 'Join us for an exciting journey of innovation and entrepreneurship.',
              imageUrl: '/team-photo-of-4-students-working-together.jpg',
              theme: 'gradient-blue',
              date: new Date().toISOString(),
              organizer: 'Innoverse Team'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching launched posters:', error);
        // Set demo posters on error as well
        setLaunchedPosters([
          {
            posterId: 'demo-1',
            title: 'Welcome to Innoverse 2025',
            subtitle: 'Innovation Awaits',
            description: 'Join us for an exciting journey of innovation and entrepreneurship.',
            imageUrl: '/team-photo-of-4-students-working-together.jpg',
            theme: 'gradient-blue',
            date: new Date().toISOString(),
            organizer: 'Innoverse Team'
          }
        ]);
      }
    };

    fetchEvents();
    fetchLaunchedPosters();
  }, []);

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
      console.log('Poster already viewed from this IP, skipping count increment');
      return;
    }

    try {
      await fetch(`/api/poster-launch/public/launched/${posterId}/view`, {
        method: 'PUT'
      });
      
      // Mark this poster as viewed from this IP
      setViewedPosters(prev => new Set([...prev, posterId]));
      
      // Update local state to reflect view count
      setLaunchedPosters(prev => 
        prev.map(poster => 
          poster.posterId === posterId 
            ? { ...poster, analytics: { ...poster.analytics, views: poster.analytics.views + 1 } }
            : poster
        )
      );
      
      console.log('View count incremented for poster:', posterId);
    } catch (error) {
      console.error('Error tracking poster view:', error);
    }
  };

  const handleViewPoster = (poster) => {
    setSelectedPoster(poster);
    setShowPosterModal(true);
    
    // Start music for Innoverse poster
    if (poster.posterId === 'innoverse-2025' && music.isLoaded) {
      music.play();
    }
    
    // Track view count
    handlePosterView(poster.posterId);
  };

  const handleViewDetails = (poster) => {
    setSelectedPoster(poster);
    setShowDetailsModal(true);
  };

  const handleClosePosterModal = () => {
    setShowPosterModal(false);
    setSelectedPoster(null);
    
    // Stop music when closing poster
    if (music.isPlaying) {
      music.stop();
    }
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
            Lean Canvas models, and prototypes. Compete for certificates, momentums and recognition in our 
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
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 text-xl shadow-2xl"
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
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-4 text-xl shadow-2xl"
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
              { number: "Certificates", label: "& Momentums", icon: "🏅" }
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

      {/* Event Details Section */}
      <section ref={eventDetailsRef} className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
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
                    <p className="font-semibold text-white">Certificates & Momentums</p>
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
                { name: "Mr. P S V Surya Kumar", designation: "Assistant Professor" },
                { name: "Mr. N Praveen", designation: "Assistant Professor" },
                { name: "Mr. P Manoj", designation: "Assistant Professor" }
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

      {/* Evaluation Criteria Section */}
      <section ref={evaluationRef} className="py-20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
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
                <h4 className="text-xl font-semibold text-white mb-4">Recognition & Rewards</h4>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 rounded-xl">
                    <span className="text-3xl mr-3">🏆</span>
                    <div>
                      <div className="text-yellow-400 font-bold">Excellence Certificate</div>
                      <div className="text-gray-400 text-sm">Outstanding performance</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-xl">
                    <span className="text-3xl mr-3">🏅</span>
                    <div>
                      <div className="text-blue-400 font-bold">Participation Certificate</div>
                      <div className="text-gray-400 text-sm">For all participants</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-xl">
                    <span className="text-3xl mr-3">🎖️</span>
                    <div>
                      <div className="text-purple-400 font-bold">Innovation Momentum</div>
                      <div className="text-gray-400 text-sm">Special recognition items</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-xl">
                    <span className="text-3xl mr-3">📜</span>
                    <div>
                      <div className="text-emerald-400 font-bold">Digital Badges</div>
                      <div className="text-gray-400 text-sm">LinkedIn & portfolio ready</div>
                    </div>
                  </div>
                </div>
              </div>
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
              isPlaying={music.isPlaying}
              onPlay={music.play}
              onPause={music.pause}
              onStop={music.stop}
              volume={music.currentVolume}
              onVolumeChange={music.setVolume}
              isVisible={selectedPoster.posterId === 'innoverse-2025'}
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
    </div>
  );
}

export default Home;

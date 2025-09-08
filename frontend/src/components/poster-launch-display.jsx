import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { useBackgroundMusic } from '../hooks/use-background-music';
import { MusicControls } from './music-controls';

function PosterLaunchDisplay() {
  const [activePoster, setActivePoster] = useState(null);
  const [showPoster, setShowPoster] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Background music for Innoverse poster
  const music = useBackgroundMusic('/innoverse.mp3', {
    autoPlay: false,
    loop: true,
    volume: 0.3,
    fadeInDuration: 2000,
    fadeOutDuration: 1000
  });

  // Mock data - in real implementation, this would come from API
  const launchedPosters = [
    {
      id: 'innoverse-2025',
      title: 'Innoverse 2025',
      subtitle: 'Startup Contest',
      description: 'A Startup Contest where we dive deep into the brain for bold ideas',
      tagline: 'Your Pitch. Your Future',
      date: 'SEPTEMBER 15 2K25',
      organizer: 'CSIT DEPARTMENT',
      theme: 'startup-innovation',
      colors: {
        primary: '#8B5CF6',
        secondary: '#06B6D4',
        accent: '#F59E0B',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e40af 100%)'
      },
      sponsors: ['Dhimavaram', 'Smart work', 'TechGuru', 'InnovaDelight'],
      hods: ['Dr N. Gopi Krishna Murthy', 'Dr M. Suresh Babu'],
      faculty: ['Mr. P.S.V. Surya Kumar', 'Mr. N. Praveen', 'Mr. P. Manoj'],
      status: 'live',
      priority: 'high'
    }
  ];

  useEffect(() => {
    // Simulate receiving a poster launch notification
    const timer = setTimeout(() => {
      if (launchedPosters.length > 0) {
        setActivePoster(launchedPosters[0]);
        setShowPoster(true);
        
        // Start background music when poster appears
        if (music.isLoaded) {
          music.play();
        }
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      // Stop music when component unmounts
      if (music.isPlaying) {
        music.stop();
      }
    };
  }, [music.isLoaded]);

  // Auto-play music when audio is loaded and poster is showing
  useEffect(() => {
    if (music.isLoaded && showPoster && activePoster && !music.isPlaying) {
      music.play();
    }
  }, [music.isLoaded, showPoster, activePoster]);

  const handleClose = () => {
    // Stop music when closing poster
    if (music.isPlaying) {
      music.stop();
    }
    setShowPoster(false);
    setActivePoster(null);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    
    // If minimizing, pause music; if expanding, resume music
    if (!isMinimized) {
      music.pause();
    } else {
      music.resume();
    }
  };

  if (!activePoster || !showPoster) return null;

  return (
    <AnimatePresence>
      {showPoster && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          style={{ perspective: '1000px' }}
        >
          {/* Poster Display */}
          <motion.div
            initial={{ rotateY: -180, scale: 0.5 }}
            animate={{ rotateY: 0, scale: isMinimized ? 0.3 : 1 }}
            transition={{ 
              duration: 1.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              rotateY: { duration: 2, ease: "easeInOut" }
            }}
            className={`relative max-w-4xl w-full ${isMinimized ? 'fixed bottom-4 right-4 max-w-sm' : ''}`}
            style={{
              transformStyle: 'preserve-3d',
              background: activePoster.colors.background
            }}
          >
            {/* Control Buttons */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleMinimize}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                {isMinimized ? '🔍' : '➖'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ❌
              </motion.button>
            </div>

            {/* 3D Poster Card */}
            <motion.div
              whileHover={{ 
                rotateX: 2, 
                rotateY: 2, 
                scale: isMinimized ? 0.35 : 1.02,
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
              }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{
                transformStyle: 'preserve-3d',
                background: activePoster.colors.background
              }}
            >
              {/* Animated Background Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    initial={{ 
                      x: Math.random() * 100 + '%', 
                      y: Math.random() * 100 + '%',
                      opacity: 0 
                    }}
                    animate={{ 
                      x: [
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%'
                      ],
                      y: [
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%'
                      ],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 6 + Math.random() * 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>

              {/* Poster Content */}
              <div className="relative z-10 p-8 text-center text-white">
                {/* Priority Indicator */}
                {activePoster.priority === 'high' && (
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-4 left-4"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                    >
                      🔥 HIGH PRIORITY
                    </motion.div>
                  </motion.div>
                )}

                {/* Header */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-center mb-4 space-x-8">
                    <motion.img 
                      src="/placeholder-logo.png" 
                      alt="College Logo" 
                      className="w-12 h-12 rounded-full shadow-lg"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.img 
                      src="/placeholder-logo.svg" 
                      alt="Event Logo" 
                      className="w-12 h-12 rounded-full shadow-lg"
                      animate={{ rotate: [360, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <h1 className="text-lg font-bold mb-2">
                    SAGI RAMA KRISHNAM RAJU ENGINEERING COLLEGE
                  </h1>
                </motion.div>

                {/* Main Title with 3D Effect */}
                <motion.div
                  initial={{ scale: 0, rotateZ: -180 }}
                  animate={{ scale: 1, rotateZ: 0 }}
                  transition={{ delay: 0.6, duration: 1, type: "spring", bounce: 0.5 }}
                  className="mb-6"
                >
                  <motion.h2
                    className={`${isMinimized ? 'text-3xl' : 'text-5xl'} font-bold mb-4`}
                    style={{
                      textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
                      background: `linear-gradient(45deg, ${activePoster.colors.primary}, ${activePoster.colors.secondary})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                    }}
                    animate={{
                      textShadow: [
                        '4px 4px 8px rgba(0,0,0,0.5)',
                        '8px 8px 16px rgba(0,0,0,0.7)',
                        '4px 4px 8px rgba(0,0,0,0.5)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {activePoster.title}
                  </motion.h2>
                </motion.div>

                {!isMinimized && (
                  <>
                    {/* Subtitle and Description */}
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="mb-6"
                    >
                      <p className="text-lg italic mb-2" style={{ color: activePoster.colors.accent }}>
                        "{activePoster.description}"
                      </p>
                      <p className="text-md font-semibold">{activePoster.tagline}</p>
                    </motion.div>

                    {/* Date with Pulsing Effect */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                      className="mb-6"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          boxShadow: [
                            '0 0 20px rgba(245, 158, 11, 0.5)',
                            '0 0 40px rgba(245, 158, 11, 0.8)',
                            '0 0 20px rgba(245, 158, 11, 0.5)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-2xl font-bold text-xl"
                      >
                        {activePoster.date}
                      </motion.div>
                    </motion.div>

                    {/* Organizer */}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.8 }}
                      className="mb-6"
                    >
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl">🚀</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{activePoster.organizer}</h3>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-xl">🚀</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2, duration: 0.8 }}
                      className="flex justify-center space-x-4"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 py-3 text-lg font-semibold">
                          📝 Register Now
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 text-lg font-semibold">
                          📖 Learn More
                        </Button>
                      </motion.div>
                    </motion.div>
                  </>
                )}
              </div>

              {/* 3D Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  boxShadow: [
                    `0 0 50px ${activePoster.colors.primary}30`,
                    `0 0 100px ${activePoster.colors.secondary}50`,
                    `0 0 50px ${activePoster.colors.primary}30`
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* Music Controls */}
            <MusicControls
              isPlaying={music.isPlaying}
              onPlay={music.play}
              onPause={music.pause}
              onStop={music.stop}
              volume={music.currentVolume}
              onVolumeChange={music.setVolume}
              isVisible={showPoster && !isMinimized}
              position="top-left"
              className="absolute top-4 left-4"
            />

            {/* Launch Notification */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center space-x-2"
              >
                <span className="text-xl">🚀</span>
                <span className="font-semibold">Just Launched!</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PosterLaunchDisplay;

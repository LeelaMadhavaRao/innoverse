import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../context/auth-context';

function Home() {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [activeSection, setActiveSection] = useState('home');

  // Refs for sections
  const homeRef = useRef(null);
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
        const response = await fetch('/api/poster-launch/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
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

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-4 py-4 mx-auto max-w-7xl lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Innoverse 2025
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(homeRef, 'home')}
                className={`transition-colors ${activeSection === 'home' ? 'text-emerald-400' : 'text-gray-300 hover:text-white'}`}
              >
                🏠 Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(eventDetailsRef, 'event-details')}
                className={`transition-colors ${activeSection === 'event-details' ? 'text-emerald-400' : 'text-gray-300 hover:text-white'}`}
              >
                📅 Event Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(teamStructureRef, 'team-structure')}
                className={`transition-colors ${activeSection === 'team-structure' ? 'text-emerald-400' : 'text-gray-300 hover:text-white'}`}
              >
                👥 Team Structure
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(evaluationRef, 'evaluation')}
                className={`transition-colors ${activeSection === 'evaluation' ? 'text-emerald-400' : 'text-gray-300 hover:text-white'}`}
              >
                🏆 Evaluation Criteria
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {!isAuthenticated ? (
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg">
                      Login
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <Link to={getStartedLink()}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={homeRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
            className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-gray-300"
          >
            Where innovative startup ideas come to life! Present your solutions with PPT, 
            Lean Canvas models, and prototypes. Compete for glory and recognition in our 
            premier entrepreneurship event.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg"
                onClick={() => scrollToSection(eventDetailsRef, 'event-details')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 text-xl shadow-2xl"
              >
                Explore Event
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline"
                size="lg"
                className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10 px-10 py-4 text-xl backdrop-blur-sm"
              >
                View Gallery
              </Button>
            </motion.div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          >
            {[
              { number: "50+", label: "Teams", icon: "👥" },
              { number: "2", label: "Days", icon: "📅" },
              { number: "10+", label: "Evaluators", icon: "🏆" },
              { number: "₹50K", label: "Prize Pool", icon: "💰" }
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
      </section>

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

          {/* Event Schedule Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-3xl font-bold text-center mb-12 text-emerald-400">Event Schedule</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { time: "9:00 AM", title: "Registration", desc: "Team check-in and setup" },
                { time: "10:00 AM", title: "Opening Ceremony", desc: "Welcome and guidelines" },
                { time: "11:00 AM", title: "Presentations Begin", desc: "Team pitches start" },
                { time: "2:00 PM", title: "Lunch Break", desc: "Networking and refreshments" },
                { time: "3:00 PM", title: "Evaluation", desc: "Judging and scoring" },
                { time: "5:00 PM", title: "Results", desc: "Winner announcement" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="text-2xl font-bold text-emerald-400 mb-2">{item.time}</div>
                  <div className="text-xl font-semibold text-white mb-2">{item.title}</div>
                  <div className="text-gray-400">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
      </section>

      {/* Team Structure Section */}
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Will be populated with actual names in next prompt */}
              {[1, 2, 3, 4].map((_, index) => (
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
                    <span className="text-2xl font-bold text-white">SC</span>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Student Coordinator {index + 1}</h4>
                  <p className="text-emerald-400 mb-2">Final Year</p>
                  <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                    Coordinator
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Will be populated with actual names in next prompt */}
              {[1, 2, 3].map((_, index) => (
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
                    <span className="text-2xl font-bold text-white">FA</span>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Faculty Advisor {index + 1}</h4>
                  <p className="text-blue-400 mb-2">Professor</p>
                  <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                    Advisor
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Heads of Department */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-3xl font-bold text-purple-400">Heads of Department</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Will be populated with actual names in next prompt */}
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-3xl border border-purple-500/20 text-center backdrop-blur-sm"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">HOD</span>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">HOD {index + 1}</h4>
                  <p className="text-purple-400 mb-2">Department Head</p>
                  <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30">
                    Head
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

        {/* Event Details & Schedule Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Event Details & Schedule</h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                A comprehensive three-day program designed to celebrate academic excellence
                and cultural innovation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Event Objectives */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold">Event Objectives</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p>Showcase innovative student projects and research</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p>Foster collaboration between departments</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p>Celebrate cultural diversity and creativity</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p>Provide networking opportunities with industry experts</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                    <p>Recognize academic excellence and achievements</p>
                  </div>
                </div>
              </div>

              {/* Event Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-4xl mb-2">👥</div>
                  <div className="text-3xl font-bold text-red-400">500+</div>
                  <div className="text-green-100">Participants</div>
                </div>
                <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-3xl font-bold text-red-400">50+</div>
                  <div className="text-green-100">Projects</div>
                </div>
                <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-4xl mb-2">📅</div>
                  <div className="text-3xl font-bold text-red-400">3</div>
                  <div className="text-green-100">Days</div>
                </div>
                <div className="text-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="text-4xl mb-2">📍</div>
                  <div className="text-3xl font-bold text-red-400">5</div>
                  <div className="text-green-100">Venues</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Structure Section */}
        <TeamStructure />

        {/* Event Schedule Section */}
        <section className="py-16 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Event Schedule</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Day 1 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Day 1 - March 15</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">09:00 AM</div>
                    <div>
                      <div className="font-semibold">Registration & Welcome</div>
                      <Badge className="mt-1 bg-gray-600 text-white">General</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">10:00 AM</div>
                    <div>
                      <div className="font-semibold">Opening Ceremony</div>
                      <Badge className="mt-1 bg-red-600 text-white">Ceremony</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">11:30 AM</div>
                    <div>
                      <div className="font-semibold">Keynote Speech</div>
                      <Badge className="mt-1 bg-blue-600 text-white">Presentation</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">02:00 PM</div>
                    <div>
                      <div className="font-semibold">Project Presentations - Round 1</div>
                      <Badge className="mt-1 bg-green-600 text-white">Competition</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Day 2 - March 16</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">09:00 AM</div>
                    <div>
                      <div className="font-semibold">Technical Workshops</div>
                      <Badge className="mt-1 bg-orange-600 text-white">Workshop</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">11:00 AM</div>
                    <div>
                      <div className="font-semibold">Project Presentations - Round 2</div>
                      <Badge className="mt-1 bg-green-600 text-white">Competition</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">02:00 PM</div>
                    <div>
                      <div className="font-semibold">Panel Discussion</div>
                      <Badge className="mt-1 bg-teal-600 text-white">Discussion</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">04:00 PM</div>
                    <div>
                      <div className="font-semibold">Innovation Showcase</div>
                      <Badge className="mt-1 bg-purple-600 text-white">Showcase</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Day 3 - March 17</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">09:00 AM</div>
                    <div>
                      <div className="font-semibold">Final Presentations</div>
                      <Badge className="mt-1 bg-green-600 text-white">Competition</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">11:00 AM</div>
                    <div>
                      <div className="font-semibold">Evaluation & Judging</div>
                      <Badge className="mt-1 bg-yellow-600 text-white">Evaluation</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">02:00 PM</div>
                    <div>
                      <div className="font-semibold">Awards Ceremony</div>
                      <Badge className="mt-1 bg-red-600 text-white">Ceremony</Badge>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-red-400 font-semibold mr-4 w-20">04:00 PM</div>
                    <div>
                      <div className="font-semibold">Closing Remarks</div>
                      <Badge className="mt-1 bg-gray-600 text-white">General</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Event Information</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <span>March 15-17, 2024</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📍</span>
                    <span>University Main Auditorium</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2 text-gray-300">
                  <div>Event Details</div>
                  <div>Team Structure</div>
                  <div>Login Portal</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">📧</span>
                    <span>event@university.edu</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📞</span>
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">University</h4>
                <p className="text-gray-300">Excellence in Education and Innovation since 1950</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              © 2024 Event Management System. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;

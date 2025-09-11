import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const FacultyInvitation = ({ facultyData, onComplete }) => {
  const [currentStage, setCurrentStage] = useState('launch'); // launch, repair, invitation
  const [showExplosion, setShowExplosion] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStage('repair');
    }, 4000);

    const timer2 = setTimeout(() => {
      setShowExplosion(true);
    }, 8000);

    const timer3 = setTimeout(() => {
      setCurrentStage('invitation');
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const getInvitationTemplate = () => {
    const { designation } = facultyData;
    
    // Debug log with essential info only
    console.log('🎯 Faculty Invitation - Designation:', designation);
    
    // Check for exact match first, then fallback to contains check
    if (designation === 'Principal' || designation?.toLowerCase().includes('principal') || designation?.toLowerCase().includes('dean')) {
      return {
        title: '👑 Distinguished Principal',
        greeting: 'Your Excellence',
        message: 'We are deeply honored to have your esteemed leadership and guidance at Innoverse 2025. Your visionary approach to education inspires innovation.',
        bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
        frameGradient: 'from-amber-400 via-yellow-500 to-orange-600',
        shadowColor: 'shadow-amber-500/40',
        particleColor: '#F59E0B',
        crown: '👑',
        specialTitle: 'Chief Guest & Visionary Leader',
        textColor: 'text-gray-900',
        accentColor: 'text-amber-800',
        borderGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.6)]'
      };
    } else if (designation === 'HOD' || designation?.toLowerCase().includes('hod') || designation?.toLowerCase().includes('head')) {
      return {
        title: '� Respected Head of Department',
        greeting: 'Dear HOD',
        message: 'Your exceptional leadership and departmental vision make you an invaluable asset to Innoverse 2025. We look forward to your guidance.',
        bgGradient: 'from-blue-50 via-indigo-50 to-purple-50',
        frameGradient: 'from-blue-400 via-indigo-500 to-purple-600',
        shadowColor: 'shadow-blue-500/40',
        particleColor: '#3B82F6',
        crown: '⭐',
        specialTitle: 'Department Leader & Innovation Champion',
        textColor: 'text-gray-900',
        accentColor: 'text-blue-800',
        borderGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.6)]'
      };
    } else if (designation === 'Professor' || designation?.toLowerCase().includes('professor')) {
      return {
        title: '🎓 Esteemed Professor',
        greeting: 'Dear Professor',
        message: 'Your academic excellence and research expertise bring immense value to Innoverse 2025. We are honored by your participation.',
        bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
        frameGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
        shadowColor: 'shadow-emerald-500/40',
        particleColor: '#10B981',
        crown: '🌟',
        specialTitle: 'Academic Excellence & Research Guide',
        textColor: 'text-gray-900',
        accentColor: 'text-emerald-800',
        borderGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]'
      };
    } else if (designation === 'Associate Professor') {
      return {
        title: '📚 Distinguished Associate Professor',
        greeting: 'Dear Associate Professor',
        message: 'Your scholarly achievements and mentoring capabilities are essential to the success of Innoverse 2025.',
        bgGradient: 'from-violet-50 via-purple-50 to-fuchsia-50',
        frameGradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
        shadowColor: 'shadow-purple-500/40',
        particleColor: '#8B5CF6',
        crown: '🔮',
        specialTitle: 'Research Mentor & Academic Scholar',
        textColor: 'text-gray-900',
        accentColor: 'text-purple-800',
        borderGlow: 'shadow-[0_0_30px_rgba(139,92,246,0.6)]'
      };
    } else {
      // Default for Assistant Professor and others
      return {
        title: '🌱 Dedicated Assistant Professor',
        greeting: 'Dear Assistant Professor',
        message: 'Your fresh perspective and innovative teaching approach inspire the next generation. Welcome to Innoverse 2025!',
        bgGradient: 'from-green-50 via-lime-50 to-yellow-50',
        frameGradient: 'from-green-400 via-lime-500 to-yellow-600',
        shadowColor: 'shadow-green-500/40',
        particleColor: '#22C55E',
        crown: '�',
        specialTitle: 'Innovation Mentor & Future Builder',
        textColor: 'text-gray-900',
        accentColor: 'text-green-800',
        borderGlow: 'shadow-[0_0_30px_rgba(34,197,94,0.6)]'
      };
    }
  };

  const template = getInvitationTemplate();

  const explosionVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.5, 1],
      opacity: [0, 1, 0.8],
      transition: {
        duration: 1,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }
    }
  };

  const invitationVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0,
      rotateY: -180
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1.5
      }
    }
  };

  const floatingParticles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute w-2 h-2 rounded-full`}
      style={{ 
        backgroundColor: template.particleColor,
        left: `${Math.random() * 100}%`,
        top: '80%'
      }}
      animate={{
        y: [0, -100, -200],
        x: [0, Math.random() * 200 - 100],
        opacity: [1, 0.5, 0],
        scale: [1, 1.5, 0]
      }}
      transition={{
        duration: 3,
        delay: i * 0.1,
        repeat: Infinity,
        repeatDelay: 2
      }}
    />
  ));

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Skip Button */}
      <motion.button
        onClick={() => {
          console.log('Skip button clicked!');
          if (onComplete) {
            onComplete();
          } else {
            console.error('onComplete function not provided');
          }
        }}
        className="fixed top-6 right-6 z-[60] bg-gray-800/90 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm font-medium">Skip</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </motion.button>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-amber-900/10 to-slate-900"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(250, 204, 21, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Animated Stars Effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 100 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-200 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 5,
                repeat: Infinity,
                repeatDelay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D Scene Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        {currentStage === 'launch' && (
          <motion.div
            animate={{
              y: [0, -100, -200],
              scale: [1, 1.2, 1.5],
              rotate: [0, 15, -15, 0]
            }}
            transition={{
              duration: 4,
              ease: "easeOut"
            }}
            className="text-9xl"
          >
            🚀
          </motion.div>
        )}
        
        {currentStage === 'repair' && (
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 0.5,
              repeat: 8
            }}
            className="text-9xl"
          >
            🔧
          </motion.div>
        )}
      </div>

      {/* Explosion Effect */}
      <AnimatePresence>
        {showExplosion && (
          <motion.div
            variants={explosionVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className={`w-96 h-96 rounded-full bg-gradient-radial from-amber-200 via-yellow-300 to-transparent opacity-50`} />
            <div className={`absolute w-64 h-64 rounded-full bg-gradient-radial from-yellow-400 to-transparent`} />
            <div className="absolute w-32 h-32 rounded-full bg-amber-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      {currentStage === 'invitation' && floatingParticles}

      {/* Invitation Card */}
      <AnimatePresence>
        {currentStage === 'invitation' && (
          <motion.div
            variants={invitationVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Ornate Frame Border with Enhanced Glow */}
            <div className={`max-w-4xl w-full max-h-[95vh] relative ${template.shadowColor} ${template.borderGlow} mx-auto`}>
              {/* Outer decorative frame */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${template.frameGradient} rounded-3xl animate-pulse`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-white via-yellow-100 to-white rounded-3xl blur-sm opacity-60"></div>
              </div>
              
              {/* Middle frame with pattern */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-2xl"></div>
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-amber-600 rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-amber-600 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-amber-600 rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-amber-600 rounded-br-lg"></div>
              </div>
              
              {/* Inner content card */}
              <Card className={`relative bg-gradient-to-br ${template.bgGradient} border-2 border-amber-300/50 backdrop-blur-lg rounded-xl overflow-hidden`}>
                <motion.div 
                  className="p-6 md:p-8 lg:p-10 text-center relative overflow-hidden max-h-[90vh] overflow-y-auto"
                  animate={{
                    background: [
                      'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.05) 0%, transparent 70%)',
                      'radial-gradient(circle at 30% 40%, rgba(245, 158, 11, 0.05) 0%, transparent 70%)',
                      'radial-gradient(circle at 70% 60%, rgba(250, 204, 21, 0.05) 0%, transparent 70%)'
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Decorative Elements */}
                  <div className={`absolute top-2 left-2 text-2xl md:text-3xl ${template.accentColor}`}>{template.crown}</div>
                  <div className={`absolute top-2 right-2 text-2xl md:text-3xl ${template.accentColor}`}>{template.crown}</div>
                  <div className="absolute bottom-2 left-2 text-2xl md:text-3xl text-amber-600">🚀</div>
                  <div className="absolute bottom-2 right-2 text-2xl md:text-3xl text-yellow-500">✨</div>

                  {/* Header */}
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mb-6"
                  >
                    <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${template.textColor} mb-2`}>
                      INNOVERSE 2025
                    </h1>
                    <div className={`w-24 md:w-32 h-1 bg-gradient-to-r ${template.frameGradient} mx-auto rounded-full`}></div>
                  </motion.div>

                  {/* Invitation Content */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 100 }}
                    className="mb-6"
                  >
                    <h2 className={`text-lg md:text-xl lg:text-2xl font-bold ${template.accentColor} mb-3`}>
                      {template.title}
                    </h2>
                    <div className={`text-sm md:text-base ${template.textColor} mb-4`}>
                      <p className="mb-2">{template.greeting} <strong className={template.accentColor}>{facultyData.name} Sir</strong>,</p>
                      <p className="mb-3 text-xs md:text-sm">{template.message}</p>
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-amber-200/50 shadow-inner">
                        <p className={`font-semibold text-sm md:text-base ${template.accentColor} mb-2`}>{template.specialTitle}</p>
                        <div className={`text-xs md:text-sm ${template.textColor}`}>
                          <p><strong>Department:</strong> {facultyData.department}</p>
                          <p><strong>Designation:</strong> {facultyData.designation}</p>
                          {facultyData.specialization && (
                            <p><strong>Specialization:</strong> {facultyData.specialization}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Event Details */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="bg-white/40 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-amber-200/30 mb-6 shadow-inner"
                  >
                    <h3 className={`text-sm md:text-base font-bold ${template.accentColor} mb-3`}>🎯 Event Details</h3>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm ${template.textColor}`}>
                      <div>
                        <strong>📅 Date:</strong> September 17, 2025
                      </div>
                      <div>
                        <strong>🕐 Time:</strong> 9:00 AM - 6:00 PM
                      </div>
                      <div>
                        <strong>📍 Venue:</strong> SRKR Engineering College
                      </div>
                      <div>
                        <strong>🎯 Focus:</strong> Startup Innovation Showcase
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2, type: "spring", stiffness: 150 }}
                  >
                    <Button
                      onClick={onComplete}
                      className={`bg-gradient-to-r ${template.frameGradient} hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-white hover:text-white px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-amber-300/50`}
                    >
                      ✨ Enter Faculty Portal ✨
                    </Button>
                  </motion.div>

                  {/* Animated Border Pattern */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none">
                    <div className="absolute inset-0 rounded-xl border-2 border-amber-300/30 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse"></div>
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent animate-pulse"></div>
                    <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent animate-pulse"></div>
                  </div>
                </motion.div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Text for Initial Stages */}
      {currentStage !== 'invitation' && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl font-semibold"
          >
            {currentStage === 'launch' ? (
              <>
                🚀 Launching Innovation Journey...
                <div className="text-sm mt-2 text-amber-200/70">Preparing your exclusive invitation</div>
              </>
            ) : (
              <>
                🔧 Crafting Perfect Experience...
                <div className="text-sm mt-2 text-amber-200/70">Personalizing your welcome</div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FacultyInvitation;

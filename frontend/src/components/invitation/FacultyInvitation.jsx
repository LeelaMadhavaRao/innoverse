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
    const isHOD = designation?.toLowerCase().includes('hod') || 
                  designation?.toLowerCase().includes('head') ||
                  designation?.toLowerCase().includes('director');
    const isPrincipal = designation?.toLowerCase().includes('principal') ||
                       designation?.toLowerCase().includes('dean');

    if (isPrincipal) {
      return {
        title: '🏛️ Distinguished Principal',
        greeting: 'Your Excellence',
        message: 'We are deeply honored to have your esteemed presence at Innoverse 2025',
        bgGradient: 'from-yellow-600 via-orange-500 to-red-600',
        particleColor: '#FFA500',
        crown: '👑',
        specialTitle: 'Chief Guest & Distinguished Leader'
      };
    } else if (isHOD) {
      return {
        title: '🎯 Respected Head of Department',
        greeting: 'Dear HOD',
        message: 'Your leadership and vision are invaluable to Innoverse 2025',
        bgGradient: 'from-purple-600 via-blue-500 to-indigo-600',
        particleColor: '#8B5CF6',
        crown: '⭐',
        specialTitle: 'Department Leader & Innovation Champion'
      };
    } else {
      return {
        title: '🎓 Esteemed Faculty Member',
        greeting: 'Dear Professor',
        message: 'Your expertise and guidance inspire innovation at Innoverse 2025',
        bgGradient: 'from-emerald-600 via-teal-500 to-cyan-600',
        particleColor: '#10B981',
        crown: '🌟',
        specialTitle: 'Innovation Mentor & Guide'
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
    <div className="fixed inset-0 z-50 bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)"
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
              className="absolute w-1 h-1 bg-white rounded-full"
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
            <div className={`w-96 h-96 rounded-full bg-gradient-radial from-white via-yellow-400 to-transparent opacity-50`} />
            <div className={`absolute w-64 h-64 rounded-full bg-gradient-radial from-orange-400 to-transparent`} />
            <div className="absolute w-32 h-32 rounded-full bg-white" />
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
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <Card className={`max-w-2xl w-full bg-gradient-to-br ${template.bgGradient} border-2 border-white/20 backdrop-blur-lg shadow-2xl`}>
              <motion.div 
                className="p-12 text-center relative overflow-hidden"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    'radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 70%)'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Decorative Elements */}
                <div className="absolute top-4 left-4 text-4xl">{template.crown}</div>
                <div className="absolute top-4 right-4 text-4xl">{template.crown}</div>
                <div className="absolute bottom-4 left-4 text-4xl">🚀</div>
                <div className="absolute bottom-4 right-4 text-4xl">✨</div>

                {/* Header */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mb-8"
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    INNOVERSE 2025
                  </h1>
                  <div className="w-32 h-1 bg-white mx-auto rounded-full"></div>
                </motion.div>

                {/* Invitation Content */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 100 }}
                  className="mb-8"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    {template.title}
                  </h2>
                  <div className="text-lg text-white/90 mb-6">
                    <p className="mb-2">{template.greeting} <strong>{facultyData.name}</strong>,</p>
                    <p className="mb-4">{template.message}</p>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20">
                      <p className="font-semibold text-xl text-white mb-2">{template.specialTitle}</p>
                      <div className="text-sm text-white/80">
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
                  className="bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-white/10 mb-8"
                >
                  <h3 className="text-xl font-bold text-white mb-4">🎯 Event Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                    <div>
                      <strong>📅 Date:</strong> March 15-16, 2025
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
                    className="bg-white text-gray-900 hover:bg-white/90 px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    ✨ Enter Faculty Portal ✨
                  </Button>
                </motion.div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg">
                  <div className="absolute inset-0 rounded-lg border-2 border-white/30 animate-pulse"></div>
                </div>
              </motion.div>
            </Card>
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
                <div className="text-sm mt-2 text-white/70">Preparing your exclusive invitation</div>
              </>
            ) : (
              <>
                🔧 Crafting Perfect Experience...
                <div className="text-sm mt-2 text-white/70">Personalizing your welcome</div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FacultyInvitation;

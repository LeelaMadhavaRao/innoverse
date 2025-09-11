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
        bgGradient: 'from-amber-50 via-yellow-50 to-white',
        frameGradient: 'from-amber-400 via-yellow-500 to-amber-600',
        shadowColor: 'shadow-amber-500/30',
        particleColor: '#F59E0B',
        crown: '👑',
        specialTitle: 'Chief Guest & Distinguished Leader',
        textColor: 'text-gray-800',
        accentColor: 'text-amber-700'
      };
    } else if (isHOD) {
      return {
        title: '🎯 Respected Head of Department',
        greeting: 'Dear HOD',
        message: 'Your leadership and vision are invaluable to Innoverse 2025',
        bgGradient: 'from-slate-50 via-blue-50 to-white',
        frameGradient: 'from-slate-300 via-blue-400 to-slate-500',
        shadowColor: 'shadow-blue-500/30',
        particleColor: '#3B82F6',
        crown: '⭐',
        specialTitle: 'Department Leader & Innovation Champion',
        textColor: 'text-gray-800',
        accentColor: 'text-blue-700'
      };
    } else {
      return {
        title: '🎓 Esteemed Faculty Member',
        greeting: 'Dear Professor',
        message: 'Your expertise and guidance inspire innovation at Innoverse 2025',
        bgGradient: 'from-emerald-50 via-teal-50 to-white',
        frameGradient: 'from-emerald-300 via-teal-400 to-emerald-500',
        shadowColor: 'shadow-emerald-500/30',
        particleColor: '#10B981',
        crown: '🌟',
        specialTitle: 'Innovation Mentor & Guide',
        textColor: 'text-gray-800',
        accentColor: 'text-emerald-700'
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
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            {/* Ornate Frame Border */}
            <div className={`max-w-2xl w-full relative ${template.shadowColor} shadow-2xl`}>
              {/* Outer decorative frame */}
              <div className={`absolute -inset-4 bg-gradient-to-r ${template.frameGradient} rounded-3xl`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-white via-amber-100 to-white rounded-3xl blur-sm opacity-50"></div>
              </div>
              
              {/* Middle frame with pattern */}
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300 rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-2xl"></div>
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-amber-600 rounded-tl-lg"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-amber-600 rounded-tr-lg"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-amber-600 rounded-bl-lg"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-amber-600 rounded-br-lg"></div>
              </div>
              
              {/* Inner content card */}
              <Card className={`relative bg-gradient-to-br ${template.bgGradient} border-2 border-amber-300/50 backdrop-blur-lg rounded-xl overflow-hidden`}>
                <motion.div 
                  className="p-12 text-center relative overflow-hidden"
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
                  <div className={`absolute top-4 left-4 text-4xl ${template.accentColor}`}>{template.crown}</div>
                  <div className={`absolute top-4 right-4 text-4xl ${template.accentColor}`}>{template.crown}</div>
                  <div className="absolute bottom-4 left-4 text-4xl text-amber-600">🚀</div>
                  <div className="absolute bottom-4 right-4 text-4xl text-yellow-500">✨</div>

                  {/* Header */}
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mb-8"
                  >
                    <h1 className={`text-4xl md:text-5xl font-bold ${template.textColor} mb-2`}>
                      INNOVERSE 2025
                    </h1>
                    <div className={`w-32 h-1 bg-gradient-to-r ${template.frameGradient} mx-auto rounded-full`}></div>
                  </motion.div>

                  {/* Invitation Content */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 100 }}
                    className="mb-8"
                  >
                    <h2 className={`text-2xl md:text-3xl font-bold ${template.accentColor} mb-4`}>
                      {template.title}
                    </h2>
                    <div className={`text-lg ${template.textColor} mb-6`}>
                      <p className="mb-2">{template.greeting} <strong className={template.accentColor}>{facultyData.name}</strong>,</p>
                      <p className="mb-4">{template.message}</p>
                      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200/50 shadow-inner">
                        <p className={`font-semibold text-xl ${template.accentColor} mb-2`}>{template.specialTitle}</p>
                        <div className={`text-sm ${template.textColor}`}>
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
                    className="bg-white/40 backdrop-blur-sm rounded-lg p-6 border border-amber-200/30 mb-8 shadow-inner"
                  >
                    <h3 className={`text-xl font-bold ${template.accentColor} mb-4`}>🎯 Event Details</h3>
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${template.textColor}`}>
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
                      className={`bg-gradient-to-r ${template.frameGradient} hover:from-amber-500 hover:via-yellow-600 hover:to-amber-700 text-white hover:text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-amber-300/50`}
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

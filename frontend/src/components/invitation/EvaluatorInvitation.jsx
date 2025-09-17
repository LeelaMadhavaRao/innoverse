import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const EvaluatorInvitation = ({ evaluatorData, onComplete }) => {
  const [currentStage, setCurrentStage] = useState('entrance'); // entrance, assessment, invitation
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStage('assessment');
      setShowParticles(true);
    }, 3500);

    const timer2 = setTimeout(() => {
      setCurrentStage('invitation');
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getInvitationTemplate = () => {
    const { type, organization } = evaluatorData;
    
    console.log('🎯 Evaluator Invitation - Type:', type, 'Organization:', organization);
    
    if (type === 'external' || organization?.toLowerCase().includes('industry') || organization?.toLowerCase().includes('company')) {
      return {
        title: '🏢 Distinguished Industry Expert',
        greeting: 'Esteemed Industry Leader',
        message: 'Your real-world expertise and industry insights are invaluable to our aspiring innovators. Join us in shaping the future of technology.',
        bgGradient: 'from-slate-50 via-gray-50 to-zinc-50',
        frameGradient: 'from-slate-600 via-gray-700 to-zinc-800',
        shadowColor: 'shadow-slate-500/40',
        particleColor: '#64748B',
        icon: '💼',
        specialTitle: 'Industry Expert & Innovation Judge',
        textColor: 'text-gray-900',
        accentColor: 'text-slate-700',
        borderGlow: 'shadow-[0_0_30px_rgba(100,116,139,0.6)]'
      };
    } else if (organization?.toLowerCase().includes('research') || organization?.toLowerCase().includes('institute')) {
      return {
        title: '🔬 Research Excellence Evaluator',
        greeting: 'Distinguished Researcher',
        message: 'Your research acumen and analytical prowess will help identify the most promising innovations. Welcome to our evaluation panel.',
        bgGradient: 'from-cyan-50 via-blue-50 to-indigo-50',
        frameGradient: 'from-cyan-500 via-blue-600 to-indigo-700',
        shadowColor: 'shadow-cyan-500/40',
        particleColor: '#06B6D4',
        icon: '🧪',
        specialTitle: 'Research Analyst & Technical Judge',
        textColor: 'text-gray-900',
        accentColor: 'text-cyan-800',
        borderGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.6)]'
      };
    } else if (organization?.toLowerCase().includes('startup') || organization?.toLowerCase().includes('entrepreneur')) {
      return {
        title: '🚀 Startup Ecosystem Evaluator',
        greeting: 'Visionary Entrepreneur',
        message: 'Your entrepreneurial journey and startup expertise make you the perfect judge for innovative business ideas.',
        bgGradient: 'from-orange-50 via-red-50 to-pink-50',
        frameGradient: 'from-orange-500 via-red-600 to-pink-700',
        shadowColor: 'shadow-orange-500/40',
        particleColor: '#F97316',
        icon: '🎯',
        specialTitle: 'Startup Mentor & Business Judge',
        textColor: 'text-gray-900',
        accentColor: 'text-orange-800',
        borderGlow: 'shadow-[0_0_30px_rgba(249,115,22,0.6)]'
      };
    } else {
      // Default for internal or academic evaluators
      return {
        title: '⚖️ Academic Excellence Evaluator',
        greeting: 'Respected Academic Evaluator',
        message: 'Your academic expertise and fair judgment are essential for maintaining the highest standards of evaluation at Innoverse 2025.',
        bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
        frameGradient: 'from-emerald-500 via-green-600 to-teal-700',
        shadowColor: 'shadow-emerald-500/40',
        particleColor: '#10B981',
        icon: '📊',
        specialTitle: 'Academic Judge & Excellence Assessor',
        textColor: 'text-gray-900',
        accentColor: 'text-emerald-800',
        borderGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]'
      };
    }
  };

  const template = getInvitationTemplate();

  const entranceVariants = {
    hidden: { 
      scale: 0.3, 
      opacity: 0,
      rotateX: -90
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 2
      }
    }
  };

  const assessmentVariants = {
    hidden: { 
      scale: 1,
      opacity: 1
    },
    visible: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        times: [0, 0.5, 1],
        ease: "easeInOut"
      }
    }
  };

  const invitationVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 50
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 1.5
      }
    }
  };

  const floatingParticles = Array.from({ length: 15 }, (_, i) => (
    <motion.div
      key={i}
      className={`absolute w-3 h-3 rounded-full`}
      style={{ 
        backgroundColor: template.particleColor,
        left: `${Math.random() * 100}%`,
        top: '70%'
      }}
      animate={{
        y: [0, -150, -300],
        x: [0, Math.random() * 150 - 75],
        opacity: [1, 0.7, 0],
        scale: [1, 1.2, 0],
        rotate: [0, 360]
      }}
      transition={{
        duration: 4,
        delay: i * 0.2,
        repeat: Infinity,
        repeatDelay: 3
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Skip Button */}
      <motion.button
        onClick={() => {
          console.log('Skip evaluator invitation clicked!');
          if (onComplete) {
            onComplete();
          } else {
            console.error('onComplete function not provided');
          }
        }}
        className="fixed top-4 right-4 z-[60] bg-gray-800/90 hover:bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 shadow-lg hover:shadow-xl cursor-pointer text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="font-medium">Skip</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </motion.button>

      {/* Animated Background - Matching home.jsx theme */}
      <div className="absolute inset-0 overflow-hidden">
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
        
        {/* Floating assessment elements */}
        <motion.div
          className="absolute top-16 left-16 text-2xl opacity-20 hidden sm:block"
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          📊
        </motion.div>
        <motion.div
          className="absolute top-32 right-16 text-xl opacity-20 hidden sm:block"
          animate={{ rotate: -360, scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        >
          ⚖️
        </motion.div>
        <motion.div
          className="absolute bottom-16 left-32 text-3xl opacity-20 hidden md:block"
          animate={{ rotate: 180, scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity }}
        >
          🎯
        </motion.div>
      </div>

      {/* Floating Particles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingParticles}
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {currentStage === 'entrance' && (
              <motion.div
                key="entrance"
                variants={entranceVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-center"
              >
                <motion.div
                  className="text-4xl sm:text-6xl lg:text-8xl mb-6 sm:mb-8"
                animate={{ 
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⚖️
              </motion.div>
              <motion.h1
                className="text-4xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                Excellence Assessment Portal
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                Preparing evaluation environment...
              </motion.p>
            </motion.div>
          )}

          {currentStage === 'assessment' && (
            <motion.div
              key="assessment"
              variants={assessmentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="text-center"
            >
              <motion.div
                className="text-6xl mb-6"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotateZ: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              >
                {template.icon}
              </motion.div>
              <motion.h1
                className="text-3xl font-bold text-white mb-4"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                Analyzing Evaluation Credentials
              </motion.h1>
              <motion.div
                className="flex justify-center items-center space-x-2 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="w-3 h-3 bg-blue-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-3 h-3 bg-purple-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                />
              </motion.div>
            </motion.div>
          )}

          {currentStage === 'invitation' && (
            <motion.div
              key="invitation"
              variants={invitationVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-2xl mx-auto"
            >
              <Card className={`p-4 sm:p-6 lg:p-8 bg-gradient-to-br ${template.bgGradient} border-2 ${template.borderGlow} backdrop-blur-sm`}>
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Header with Icon */}
                  <motion.div
                    className="text-4xl sm:text-5xl lg:text-6xl mb-4"
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {template.icon}
                  </motion.div>

                  {/* Title and Greeting */}
                  <motion.div
                    className={`bg-gradient-to-r ${template.frameGradient} bg-clip-text text-transparent`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{template.title}</h1>
                    <p className={`text-base sm:text-lg font-semibold ${template.accentColor} mb-4`}>
                      {template.greeting}
                    </p>
                  </motion.div>

                  {/* Personal Info */}
                  <motion.div
                    className="mb-6 p-4 bg-white/20 rounded-lg backdrop-blur-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className={`text-xl font-bold ${template.textColor} mb-2`}>
                      {evaluatorData.name}
                    </h2>
                    <p className={`text-sm font-medium ${template.accentColor}`}>
                      {template.specialTitle}
                    </p>
                    {evaluatorData.organization && (
                      <p className={`text-sm ${template.textColor} mt-1`}>
                        {evaluatorData.organization}
                      </p>
                    )}
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <p className={`text-base leading-relaxed ${template.textColor} mb-4`}>
                      {template.message}
                    </p>
                    <div className="bg-white/30 p-4 rounded-lg backdrop-blur-sm">
                      <p className={`text-sm font-semibold ${template.accentColor} mb-2`}>
                        🎯 Your Evaluation Responsibilities:
                      </p>
                      <ul className={`text-sm ${template.textColor} text-left space-y-1`}>
                        <li>• Problem Statement Analysis</li>
                        <li>• Team Involvement Assessment</li>
                        <li>• Lean Canvas Model Evaluation</li>
                        <li>• Prototype Quality Review</li>
                      </ul>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <Button
                      onClick={() => {
                        console.log('Access Evaluator Portal clicked!');
                        if (onComplete) {
                          onComplete();
                        }
                      }}
                      className={`
                        bg-gradient-to-r ${template.frameGradient} 
                        hover:shadow-lg hover:shadow-current/25 
                        text-white font-semibold py-3 px-8 rounded-lg 
                        transform transition-all duration-300 
                        hover:scale-105 active:scale-95
                        ${template.shadowColor}
                      `}
                    >
                      🚀 Access Evaluator Portal
                    </Button>
                  </motion.div>

                  {/* Footer */}
                  <motion.div
                    className="mt-6 pt-4 border-t border-white/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                  >
                    <p className={`text-xs ${template.textColor} opacity-75`}>
                      Innoverse 2025 • Excellence in Innovation Assessment
                    </p>
                  </motion.div>
                </motion.div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorInvitation;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import EvaluatorInvitation from '../../components/invitation/EvaluatorInvitation';
import Navigation from '../../components/navigation';
import { motion } from 'framer-motion';

const EvaluatorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showEvaluatorInvitation, setShowEvaluatorInvitation] = useState(false);

  useEffect(() => {
    // Check if we should show the evaluator invitation
    const urlParams = new URLSearchParams(location.search);
    const showInvitation = urlParams.get('showInvitation');
    const evaluatorInvitationFlag = localStorage.getItem('showEvaluatorInvitation');

    if (user && user.role === 'evaluator' && (showInvitation === 'true' || evaluatorInvitationFlag === 'true')) {
      console.log('🎯 Evaluator Invitation - Using actual user data for evaluator invitation');
      
      // Show the invitation
      setShowEvaluatorInvitation(true);
      
      // Clear the invitation flag
      localStorage.removeItem('showEvaluatorInvitation');
      
      // Clean URL
      if (showInvitation === 'true') {
        window.history.replaceState({}, document.title, '/evaluator');
      }
    }
  }, [user, location]);

  const handleEvaluatorInvitationComplete = () => {
    console.log('🎯 Evaluator invitation completed, hiding modal');
    setShowEvaluatorInvitation(false);
  };

  // If invitation should be shown, render it
  if (showEvaluatorInvitation && user) {
    return (
      <EvaluatorInvitation
        evaluatorData={{
          name: user.name,
          email: user.email,
          organization: user.evaluatorProfile?.organization || 'Innoverse Evaluation Panel',
          type: user.evaluatorProfile?.type || 'internal',
          expertise: user.evaluatorProfile?.expertise || []
        }}
        onComplete={handleEvaluatorInvitationComplete}
      />
    );
  }

  // Regular dashboard content
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Universal Navigation */}
      <Navigation />
      
      {/* Main Content with home.jsx theme */}
      <div className="relative min-h-screen pt-16">
        {/* Animated Background - Matching home.jsx */}
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

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Welcome Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 mb-8">
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotateY: [0, 360]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ⚖️
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  Welcome to Innoverse 2025 Evaluation Portal
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Hello <span className="text-emerald-400 font-semibold">{user?.name || 'Evaluator'}</span>! 
                  You're about to embark on an exciting journey of evaluating innovative startup ideas and prototypes from talented students.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
                <div className="text-3xl mb-2">📝</div>
                <h3 className="font-semibold text-white">Teams to Evaluate</h3>
                <p className="text-2xl font-bold text-emerald-400">12</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="font-semibold text-white">Completed</h3>
                <p className="text-2xl font-bold text-teal-400">0</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
                <div className="text-3xl mb-2">⏳</div>
                <h3 className="font-semibold text-white">Pending</h3>
                <p className="text-2xl font-bold text-cyan-400">12</p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-white">Progress</h3>
                <p className="text-2xl font-bold text-emerald-400">0%</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 cursor-pointer"
                onClick={() => navigate('/evaluator/evaluation')}
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">⚖️</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Start Evaluation</h3>
                    <p className="text-gray-300">Begin evaluating team projects</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 cursor-pointer"
                onClick={() => navigate('/evaluator/criteria')}
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">📊</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">View Criteria</h3>
                    <p className="text-gray-300">Review evaluation guidelines</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 cursor-pointer"
                onClick={() => navigate('/evaluator/profile')}
              >
                <div className="flex items-center">
                  <div className="text-4xl mr-4">👤</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">My Profile</h3>
                    <p className="text-gray-300">Update your information</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Evaluation Guidelines */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                Evaluation Guidelines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">📋 Evaluation Criteria</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="text-emerald-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">Problem Statement (25%):</strong> Innovation and relevance</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-teal-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">Team Involvement (25%):</strong> Collaboration and participation</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">Lean Canvas Model (25%):</strong> Business viability</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-emerald-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">Prototype Quality (25%):</strong> Technical implementation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">⭐ Scoring Scale</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="text-red-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">1-2:</strong> Poor - Needs significant improvement</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-orange-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">3-4:</strong> Fair - Below expectations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">5-6:</strong> Good - Meets expectations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">7-8:</strong> Very Good - Exceeds expectations</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-400 mr-2">•</span>
                      <span className="text-gray-300"><strong className="text-white">9-10:</strong> Excellent - Outstanding work</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorDashboard;
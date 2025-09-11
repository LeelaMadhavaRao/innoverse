import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import Navigation from '../../components/navigation';
import { teamAPI } from '../../lib/api';
import { useAuth } from '../../context/auth-context';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const TeamResults = () => {
  const { user } = useAuth();
  const [evaluationResults, setEvaluationResults] = useState([]);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('rankings'); // 'rankings', 'detailed'
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resultsReleased, setResultsReleased] = useState(false);

  useEffect(() => {
    const fetchTeamResults = async () => {
      setLoading(true);
      try {
        // Fetch team's evaluation results from backend
        let response;
        try {
          response = await teamAPI.getResults();
          console.log('Team results response:', response);
          
          if (response?.data) {
            const results = Array.isArray(response.data) ? response.data : [];
            setEvaluationResults(results);
            setResultsReleased(results.length > 0);
            
            // Store team stats
            const stats = {
              totalEvaluations: results.length,
              averageScore: results.length > 0 
                ? Math.round(results.reduce((sum, result) => sum + (result.score || 0), 0) / results.length)
                : 0,
              highestScore: results.length > 0 ? Math.max(...results.map(result => result.score || 0)) : 0
            };
            window.teamStats = stats;
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          console.log('Team results API failed:', error.message);
          
          // Fallback - check if evaluations exist but results aren't released
          try {
            // Try to get team info to see if evaluations are in progress
            const teamInfo = await teamAPI.getProfile();
            if (teamInfo?.data) {
              setTeamData(teamInfo.data);
              // If team exists but no results, evaluations might be in progress
              setEvaluationResults([]);
              setResultsReleased(false);
              
              window.teamStats = {
                totalEvaluations: 0,
                averageScore: 0,
                highestScore: 0,
                evaluationsInProgress: true
              };
            }
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            setEvaluationResults([]);
            setResultsReleased(false);
          }
        }
      } catch (error) {
        console.error('Error fetching team results:', error);
        setEvaluationResults([]);
        setResultsReleased(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamResults();
  }, []);

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  const getScoreColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score, maxScore = 100) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (percentage >= 80) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (percentage >= 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (percentage >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Presentation': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Technical': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Business': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Innovation': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'General': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation */}
      <Navigation />
      
      <div className="pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <div className="relative z-10 p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Team Results
              </h1>
              <p className="text-xl text-gray-300">
                View your evaluation results and performance metrics
              </p>
            </motion.div>

            {/* Status Banner */}
            <motion.div variants={itemVariants} className="mb-8">
              <Card className={`p-6 text-center ${resultsReleased 
                ? 'bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-emerald-500/30' 
                : 'bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-500/30'
              }`}>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl">
                    {resultsReleased ? '✅' : '⏳'}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${resultsReleased ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {resultsReleased ? 'Results Available' : 'Results Pending'}
                    </h3>
                    <p className="text-gray-300">
                      {resultsReleased 
                        ? 'Your evaluation results are now available'
                        : 'Your results will be available once evaluators release them'
                      }
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Statistics - Moved above team results */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">📈 Your Performance Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    title: "Total Evaluations", 
                    value: (window.teamStats?.totalEvaluations || evaluationResults.length), 
                    icon: "📝", 
                    color: "from-purple-500 to-pink-600" 
                  },
                  { 
                    title: "Average Score", 
                    value: (window.teamStats?.averageScore || (evaluationResults.length > 0 ? Math.round(evaluationResults.reduce((sum, result) => sum + (result.score || 0), 0) / evaluationResults.length) : 0)) || 0, 
                    icon: "📊", 
                    color: "from-blue-500 to-indigo-600" 
                  },
                  { 
                    title: "Highest Score", 
                    value: (window.teamStats?.highestScore || (evaluationResults.length > 0 ? Math.max(...evaluationResults.map(result => result.score || 0)) : 0)) || 0, 
                    icon: "🏆", 
                    color: "from-yellow-500 to-orange-600" 
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-purple-500/20 text-center"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full mx-auto mb-4 flex items-center justify-center text-2xl shadow-2xl`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <h3 className="text-gray-300 font-medium">{stat.title}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* View Toggle */}
            {resultsReleased && (
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex justify-center gap-2">
                  <Button
                    variant={viewMode === 'rankings' ? 'default' : 'outline'}
                    onClick={() => setViewMode('rankings')}
                    className={viewMode === 'rankings' 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" 
                      : "border-purple-500/50 text-purple-400 hover:bg-purple-600/10"
                    }
                  >
                    🏆 Overview
                  </Button>
                  <Button
                    variant={viewMode === 'detailed' ? 'default' : 'outline'}
                    onClick={() => setViewMode('detailed')}
                    className={viewMode === 'detailed' 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" 
                      : "border-purple-500/50 text-purple-400 hover:bg-purple-600/10"
                    }
                  >
                    📊 Detailed View
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Results Content */}
            {resultsReleased ? (
              <>
                {/* Overview Mode */}
                {viewMode === 'rankings' && (
                  <motion.div variants={containerVariants} className="grid gap-4 mb-8">
                    {evaluationResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="group"
                      >
                        <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm">
                          <div className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                {/* Evaluation Badge */}
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl">
                                  📊
                                </div>
                                
                                {/* Evaluation Info */}
                                <div>
                                  <h3 className="text-2xl font-bold text-white mb-1">
                                    {result.evaluationTitle || 'Project Evaluation'}
                                  </h3>
                                  <p className="text-purple-400 font-medium">👨‍🏫 {result.evaluatorName}</p>
                                  <p className="text-gray-400 text-sm">📅 {new Date(result.evaluatedAt).toLocaleDateString()}</p>
                                </div>
                              </div>

                              {/* Score */}
                              <div className="text-right">
                                <div className={`text-4xl font-bold mb-1 ${getScoreColor(result.score, result.maxScore)}`}>
                                  {result.score}/{result.maxScore}
                                </div>
                                <Badge className={getCategoryColor(result.category)}>
                                  {result.category}
                                </Badge>
                                <Button
                                  onClick={() => handleViewDetails(result)}
                                  className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Detailed View */}
                {viewMode === 'detailed' && (
                  <motion.div variants={containerVariants} className="mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {evaluationResults.map((result) => (
                        <motion.div
                          key={result.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className="group"
                        >
                          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-sm">
                            <div className="p-6">
                              {/* Header */}
                              <div className="flex items-start justify-between mb-6">
                                <div>
                                  <h3 className="text-xl font-bold text-white mb-1">
                                    {result.evaluationTitle || 'Project Evaluation'}
                                  </h3>
                                  <p className="text-purple-400 font-medium">{result.evaluatorName}</p>
                                </div>
                                <Badge className={getScoreBadgeColor(result.score, result.maxScore)}>
                                  {Math.round((result.score / result.maxScore) * 100)}%
                                </Badge>
                              </div>

                              {/* Score Breakdown */}
                              {result.criteria && (
                                <div className="space-y-3 mb-6">
                                  {result.criteria.map((criterion, index) => (
                                    <div key={index}>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-300">{criterion.name}</span>
                                        <span className="text-white font-semibold">{criterion.score}/{criterion.maxScore}</span>
                                      </div>
                                      <div className="w-full bg-gray-700 rounded-full h-2">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          whileInView={{ width: `${(criterion.score / criterion.maxScore) * 100}%` }}
                                          transition={{ duration: 1, delay: index * 0.1 }}
                                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Feedback */}
                              {result.feedback && (
                                <div className="pt-4 border-t border-gray-700/50">
                                  <h4 className="text-white font-semibold mb-2">💬 Feedback:</h4>
                                  <p className="text-gray-300 text-sm">{result.feedback}</p>
                                </div>
                              )}

                              {/* Action Button */}
                              <Button
                                onClick={() => handleViewDetails(result)}
                                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                              >
                                View Full Details
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              /* Results Not Available */
              <motion.div
                variants={itemVariants}
                className="text-center py-16"
              >
                <div className="text-8xl mb-6">🔒</div>
                <h3 className="text-3xl font-bold text-gray-400 mb-4">Results Not Yet Available</h3>
                <p className="text-gray-500 text-lg mb-8">
                  Your evaluation results will appear here once the evaluators release them.
                </p>
                <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
                  <p className="text-orange-400 font-medium">
                    📊 Evaluations may be in progress • 
                    ⏳ Results will be available after review • 
                    🔒 Stay tuned for updates
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedResult && (
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
              className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl"
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 bg-gray-700/80 backdrop-blur-sm text-white rounded-full p-2 hover:bg-gray-600/80 transition-all duration-200 z-20"
              >
                ✕
              </motion.button>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[90vh]">
                <h2 className="text-3xl font-bold text-white mb-6 pr-12">
                  {selectedResult.evaluationTitle || 'Evaluation Details'}
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {/* Evaluation Info */}
                  <Card className="bg-gray-800/50 border-purple-500/20 p-6">
                    <h3 className="text-purple-400 font-semibold mb-4 text-xl">
                      📋 Evaluation Information
                    </h3>
                    <div className="space-y-3 text-gray-300">
                      <p><strong className="text-white">👨‍🏫 Evaluator:</strong> {selectedResult.evaluatorName}</p>
                      <p><strong className="text-white">📅 Date:</strong> {new Date(selectedResult.evaluatedAt).toLocaleDateString()}</p>
                      <p><strong className="text-white">🏷️ Category:</strong> {selectedResult.category}</p>
                      <p><strong className="text-white">🎯 Total Score:</strong> 
                        <span className={`ml-2 font-bold ${getScoreColor(selectedResult.score, selectedResult.maxScore)}`}>
                          {selectedResult.score}/{selectedResult.maxScore}
                        </span>
                      </p>
                    </div>
                  </Card>

                  {/* Score Breakdown */}
                  {selectedResult.criteria && (
                    <Card className="bg-gray-800/50 border-purple-500/20 p-6">
                      <h3 className="text-purple-400 font-semibold mb-4 text-xl">
                        📊 Score Breakdown
                      </h3>
                      <div className="space-y-4">
                        {selectedResult.criteria.map((criterion, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-300">{criterion.name}</span>
                              <span className="text-white font-semibold">{criterion.score}/{criterion.maxScore}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(criterion.score / criterion.maxScore) * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                {/* Feedback Section */}
                {selectedResult.feedback && (
                  <Card className="bg-gray-800/50 border-purple-500/20 p-6">
                    <h3 className="text-purple-400 font-semibold mb-4 text-xl">
                      💬 Evaluator Feedback
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{selectedResult.feedback}</p>
                  </Card>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamResults;

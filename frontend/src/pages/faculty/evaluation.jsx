import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import FacultyLayout from '../../components/layout/faculty-layout';
import { facultyAPI, teamAPI } from '../../lib/api';

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

const FacultyEvaluation = () => {
  const [evaluatedTeams, setEvaluatedTeams] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('rankings'); // 'rankings', 'detailed'
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [resultsReleased, setResultsReleased] = useState(false);

  useEffect(() => {
    const fetchEvaluationData = async () => {
      setLoading(true);
      try {
        // Fetch evaluated teams and rankings
        let response;
        try {
          response = await facultyAPI.getEvaluationResults();
        } catch (error) {
          console.log('Faculty API failed, trying team API');
          response = await teamAPI.getAllTeams();
        }

        // Process the data
        const mockData = [
          {
            id: 'team-1',
            name: 'HealthTech Team',
            leader: 'Sarah Johnson',
            members: ['Sarah Johnson', 'Mike Davis', 'Emma Wilson'],
            idea: 'Remote patient monitoring app with real-time alerts',
            totalScore: 92,
            evaluationResults: {
              problemStatement: 24,
              teamInvolvement: 23,
              leanCanvas: 22,
              prototype: 23
            },
            evaluatedBy: 'Dr. Smith',
            evaluatedAt: new Date('2024-01-20'),
            rank: 1
          },
          {
            id: 'team-2',
            name: 'Tech Innovators',
            leader: 'John Doe',
            members: ['John Doe', 'Jane Smith', 'Bob Johnson'],
            idea: 'AI-powered learning platform for personalized education',
            totalScore: 85,
            evaluationResults: {
              problemStatement: 22,
              teamInvolvement: 20,
              leanCanvas: 21,
              prototype: 22
            },
            evaluatedBy: 'Dr. Johnson',
            evaluatedAt: new Date('2024-01-19'),
            rank: 2
          },
          {
            id: 'team-3',
            name: 'Green Solutions',
            leader: 'Alice Wilson',
            members: ['Alice Wilson', 'Charlie Brown', 'David Lee'],
            idea: 'Sustainable waste management system using IoT sensors',
            totalScore: 78,
            evaluationResults: {
              problemStatement: 20,
              teamInvolvement: 19,
              leanCanvas: 19,
              prototype: 20
            },
            evaluatedBy: 'Dr. Brown',
            evaluatedAt: new Date('2024-01-18'),
            rank: 3
          },
          {
            id: 'team-4',
            name: 'Future Finance',
            leader: 'Mark Thompson',
            members: ['Mark Thompson', 'Lisa Wang', 'Ryan Miller'],
            idea: 'Blockchain-based micro-lending platform',
            totalScore: 75,
            evaluationResults: {
              problemStatement: 19,
              teamInvolvement: 18,
              leanCanvas: 19,
              prototype: 19
            },
            evaluatedBy: 'Dr. Wilson',
            evaluatedAt: new Date('2024-01-17'),
            rank: 4
          },
          {
            id: 'team-5',
            name: 'Smart City',
            leader: 'Elena Rodriguez',
            members: ['Elena Rodriguez', 'Kevin Park', 'Amy Chen'],
            idea: 'IoT-based traffic optimization system',
            totalScore: 72,
            evaluationResults: {
              problemStatement: 18,
              teamInvolvement: 18,
              leanCanvas: 18,
              prototype: 18
            },
            evaluatedBy: 'Dr. Davis',
            evaluatedAt: new Date('2024-01-16'),
            rank: 5
          }
        ];

        setEvaluatedTeams(mockData);
        setRankings(mockData.sort((a, b) => b.totalScore - a.totalScore));
        setResultsReleased(true); // Mock: results are released
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, []);

  const handleViewDetails = (team) => {
    setSelectedTeam(team);
    setShowDetailModal(true);
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-amber-600';
      case 2: return 'from-gray-400 to-gray-500';
      case 3: return 'from-orange-600 to-orange-700';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getRankEmoji = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏆';
    }
  };

  if (loading) {
    return (
      <FacultyLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
          />
        </div>
      </FacultyLayout>
    );
  }

  return (
    <FacultyLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)"
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
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Evaluation Results
              </h1>
              <p className="text-xl text-gray-300">
                View team rankings and detailed evaluation results
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
                      {resultsReleased ? 'Results Released' : 'Results Pending'}
                    </h3>
                    <p className="text-gray-300">
                      {resultsReleased 
                        ? 'Evaluation results are now available for all teams'
                        : 'Results will be released after all evaluations are complete'
                      }
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* View Toggle */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex justify-center gap-2">
                <Button
                  variant={viewMode === 'rankings' ? 'default' : 'outline'}
                  onClick={() => setViewMode('rankings')}
                  className={viewMode === 'rankings' 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white" 
                    : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10"
                  }
                >
                  🏆 Rankings
                </Button>
                <Button
                  variant={viewMode === 'detailed' ? 'default' : 'outline'}
                  onClick={() => setViewMode('detailed')}
                  className={viewMode === 'detailed' 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white" 
                    : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10"
                  }
                >
                  📊 Detailed View
                </Button>
              </div>
            </motion.div>

            {/* Rankings View */}
            {viewMode === 'rankings' && (
              <motion.div variants={containerVariants} className="grid gap-4 mb-8">
                {rankings.map((team, index) => (
                  <motion.div
                    key={team.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            {/* Rank Badge */}
                            <div className={`w-16 h-16 bg-gradient-to-br ${getRankColor(team.rank)} rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-2xl`}>
                              {getRankEmoji(team.rank)}
                            </div>
                            
                            {/* Team Info */}
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-1">
                                #{team.rank} {team.name}
                              </h3>
                              <p className="text-emerald-400 font-medium">👤 {team.leader}</p>
                              <p className="text-gray-400 text-sm">👥 {team.members.length} members</p>
                            </div>
                          </div>

                          {/* Score */}
                          <div className="text-right">
                            <div className="text-4xl font-bold text-emerald-400 mb-1">
                              {team.totalScore}
                            </div>
                            <p className="text-gray-400 text-sm">/ 100 points</p>
                            <Button
                              onClick={() => handleViewDetails(team)}
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
              <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {evaluatedTeams.map((team) => (
                  <motion.div
                    key={team.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group"
                  >
                    <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1 flex items-center">
                              <span className={`w-6 h-6 bg-gradient-to-br ${getRankColor(team.rank)} rounded-full mr-3 flex items-center justify-center text-sm font-bold`}>
                                {team.rank}
                              </span>
                              {team.name}
                            </h3>
                            <p className="text-emerald-400 font-medium">👤 {team.leader}</p>
                          </div>
                          <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30">
                            {team.totalScore}/100
                          </Badge>
                        </div>

                        {/* Evaluation Breakdown */}
                        <div className="space-y-3 mb-6">
                          {[
                            { label: 'Problem Statement', score: team.evaluationResults.problemStatement, max: 25, color: 'bg-blue-500' },
                            { label: 'Team Involvement', score: team.evaluationResults.teamInvolvement, max: 25, color: 'bg-green-500' },
                            { label: 'Lean Canvas', score: team.evaluationResults.leanCanvas, max: 25, color: 'bg-purple-500' },
                            { label: 'Prototype', score: team.evaluationResults.prototype, max: 25, color: 'bg-orange-500' }
                          ].map((item, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-300">{item.label}</span>
                                <span className="text-white font-semibold">{item.score}/{item.max}</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${(item.score / item.max) * 100}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className={`h-2 rounded-full ${item.color}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Evaluation Info */}
                        <div className="pt-4 border-t border-gray-700/50">
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>Evaluated by: {team.evaluatedBy}</span>
                            <span>{new Date(team.evaluatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          onClick={() => handleViewDetails(team)}
                          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          View Full Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Statistics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Teams Evaluated", value: evaluatedTeams.length, icon: "✅", color: "from-emerald-500 to-teal-600" },
                { title: "Average Score", value: Math.round(evaluatedTeams.reduce((sum, team) => sum + team.totalScore, 0) / evaluatedTeams.length) || 0, icon: "📊", color: "from-blue-500 to-indigo-600" },
                { title: "Highest Score", value: Math.max(...evaluatedTeams.map(team => team.totalScore)) || 0, icon: "🏆", color: "from-yellow-500 to-orange-600" },
                { title: "Results Status", value: resultsReleased ? "Released" : "Pending", icon: resultsReleased ? "🔓" : "🔒", color: resultsReleased ? "from-green-500 to-emerald-600" : "from-orange-500 to-red-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-emerald-500/20 text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full mx-auto mb-4 flex items-center justify-center text-2xl shadow-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <h3 className="text-gray-300 font-medium">{stat.title}</h3>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedTeam && (
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
                className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl"
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
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getRankColor(selectedTeam.rank)} rounded-full mr-4 flex items-center justify-center text-xl font-bold text-white`}>
                      {getRankEmoji(selectedTeam.rank)}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {selectedTeam.name}
                      </h2>
                      <p className="text-emerald-400 text-lg">Rank #{selectedTeam.rank}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Team Information */}
                    <Card className="bg-gray-800/50 border-emerald-500/20 p-6">
                      <h3 className="text-emerald-400 font-semibold mb-4 text-xl">Team Information</h3>
                      <div className="space-y-3 text-gray-300">
                        <p><strong className="text-white">Leader:</strong> {selectedTeam.leader}</p>
                        <p><strong className="text-white">Members:</strong> {selectedTeam.members.join(', ')}</p>
                        <p><strong className="text-white">Total Score:</strong> <span className="text-emerald-400 font-bold">{selectedTeam.totalScore}/100</span></p>
                      </div>
                    </Card>

                    {/* Evaluation Details */}
                    <Card className="bg-gray-800/50 border-emerald-500/20 p-6">
                      <h3 className="text-purple-400 font-semibold mb-4 text-xl">Evaluation Details</h3>
                      <div className="space-y-3 text-gray-300">
                        <p><strong className="text-white">Evaluated by:</strong> {selectedTeam.evaluatedBy}</p>
                        <p><strong className="text-white">Date:</strong> {new Date(selectedTeam.evaluatedAt).toLocaleDateString()}</p>
                        <p><strong className="text-white">Rank:</strong> #{selectedTeam.rank} out of {evaluatedTeams.length}</p>
                      </div>
                    </Card>
                  </div>

                  {/* Problem Statement */}
                  <Card className="bg-gray-800/50 border-emerald-500/20 p-6 mb-6">
                    <h3 className="text-blue-400 font-semibold mb-4 text-xl">Problem Statement</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedTeam.idea}</p>
                  </Card>

                  {/* Detailed Scores */}
                  <Card className="bg-gray-800/50 border-emerald-500/20 p-6">
                    <h3 className="text-orange-400 font-semibold mb-4 text-xl">Score Breakdown</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Problem Statement', score: selectedTeam.evaluationResults.problemStatement, max: 25, color: 'bg-blue-500' },
                        { label: 'Team Involvement', score: selectedTeam.evaluationResults.teamInvolvement, max: 25, color: 'bg-green-500' },
                        { label: 'Lean Canvas', score: selectedTeam.evaluationResults.leanCanvas, max: 25, color: 'bg-purple-500' },
                        { label: 'Prototype', score: selectedTeam.evaluationResults.prototype, max: 25, color: 'bg-orange-500' }
                      ].map((item, index) => (
                        <div key={index} className="p-4 bg-gray-700/30 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-300 font-medium">{item.label}</span>
                            <span className="text-white font-bold text-lg">{item.score}/{item.max}</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${item.color}`}
                              style={{ width: `${(item.score / item.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FacultyLayout>
  );
};

export default FacultyEvaluation;

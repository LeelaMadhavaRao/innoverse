import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import Navigation from '../../components/navigation';
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

const FacultyResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('rankings'); // 'rankings', 'analytics', 'trends'
  const [resultsReleased, setResultsReleased] = useState(true); // Mock: results are released
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock evaluation results data
  useEffect(() => {
    const mockResults = [
      {
        rank: 1,
        teamId: 2,
        teamName: "EcoTech Solutions",
        projectTitle: "Smart Waste Management System",
        teamLeader: "Arjun Reddy",
        averageScore: 89.7,
        totalScore: 269.0,
        maxScore: 300,
        evaluations: [
          { evaluatorName: "Dr. Arjun Patel", score: 92, criteria: { problemStatement: 23, teamInvolvement: 22, leanCanvas: 24, prototypeQuality: 23 } },
          { evaluatorName: "Prof. Kavita Singh", score: 89, criteria: { problemStatement: 22, teamInvolvement: 23, leanCanvas: 22, prototypeQuality: 22 } },
          { evaluatorName: "Dr. Ravi Kumar", score: 88, criteria: { problemStatement: 21, teamInvolvement: 22, leanCanvas: 23, prototypeQuality: 22 } }
        ],
        performance: {
          innovation: 95,
          technical: 87,
          business: 92,
          presentation: 88
        },
        status: 'completed'
      },
      {
        rank: 2,
        teamId: 1,
        teamName: "AI Innovators",
        projectTitle: "Smart Learning Platform",
        teamLeader: "Priya Sharma",
        averageScore: 83.5,
        totalScore: 250.5,
        maxScore: 300,
        evaluations: [
          { evaluatorName: "Dr. Arjun Patel", score: 85, criteria: { problemStatement: 21, teamInvolvement: 21, leanCanvas: 22, prototypeQuality: 21 } },
          { evaluatorName: "Prof. Kavita Singh", score: 82, criteria: { problemStatement: 20, teamInvolvement: 20, leanCanvas: 21, prototypeQuality: 21 } },
          { evaluatorName: "Dr. Ravi Kumar", score: null, criteria: null }
        ],
        performance: {
          innovation: 88,
          technical: 85,
          business: 80,
          presentation: 81
        },
        status: 'pending'
      },
      {
        rank: 3,
        teamId: 4,
        teamName: "FinTech Pioneers",
        projectTitle: "Blockchain Payment System",
        teamLeader: "Vikram Kumar",
        averageScore: 83.7,
        totalScore: 251.0,
        maxScore: 300,
        evaluations: [
          { evaluatorName: "Dr. Arjun Patel", score: 86, criteria: { problemStatement: 22, teamInvolvement: 21, leanCanvas: 22, prototypeQuality: 21 } },
          { evaluatorName: "Prof. Kavita Singh", score: 84, criteria: { problemStatement: 21, teamInvolvement: 21, leanCanvas: 21, prototypeQuality: 21 } },
          { evaluatorName: "Dr. Ravi Kumar", score: 81, criteria: { problemStatement: 20, teamInvolvement: 20, leanCanvas: 20, prototypeQuality: 21 } }
        ],
        performance: {
          innovation: 82,
          technical: 88,
          business: 85,
          presentation: 80
        },
        status: 'completed'
      },
      {
        rank: 4,
        teamId: 3,
        teamName: "HealthTech Warriors",
        projectTitle: "Remote Health Monitor",
        teamLeader: "Kavitha Rao",
        averageScore: 78.0,
        totalScore: 78.0,
        maxScore: 300,
        evaluations: [
          { evaluatorName: "Dr. Arjun Patel", score: 78, criteria: { problemStatement: 19, teamInvolvement: 19, leanCanvas: 20, prototypeQuality: 20 } },
          { evaluatorName: "Prof. Kavita Singh", score: null, criteria: null },
          { evaluatorName: "Dr. Ravi Kumar", score: null, criteria: null }
        ],
        performance: {
          innovation: 75,
          technical: 80,
          business: 78,
          presentation: 79
        },
        status: 'pending'
      }
    ];

    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, []);

  const getRankBadge = (rank) => {
    if (rank === 1) return { emoji: '🥇', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white', label: 'Winner' };
    if (rank === 2) return { emoji: '🥈', color: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white', label: '2nd Place' };
    if (rank === 3) return { emoji: '🥉', color: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white', label: '3rd Place' };
    return { emoji: `#${rank}`, color: 'bg-blue-100 text-blue-800', label: `Rank ${rank}` };
  };

  const getPerformanceColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleTeamDetail = (team) => {
    setSelectedTeam(team);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation userRole="faculty" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Loading evaluation results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resultsReleased) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation userRole="faculty" />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="p-12 text-center">
            <div className="text-6xl mb-6">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Not Yet Released</h2>
            <p className="text-gray-600 mb-6">
              The evaluation process is still ongoing. Results will be available once all evaluations are completed and officially released.
            </p>
            <Badge className="px-6 py-2 text-lg">
              📊 Evaluation in Progress
            </Badge>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation userRole="faculty" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Evaluation Results
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Final rankings and comprehensive team performance analysis
          </p>
          <Badge className="px-6 py-2 text-lg bg-green-100 text-green-800">
            ✅ Results Released
          </Badge>
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <Button
              onClick={() => setViewMode('rankings')}
              className={`px-6 py-2 rounded-md transition-all ${
                viewMode === 'rankings' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              🏆 Rankings
            </Button>
            <Button
              onClick={() => setViewMode('analytics')}
              className={`px-6 py-2 rounded-md transition-all ${
                viewMode === 'analytics' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              📊 Analytics
            </Button>
            <Button
              onClick={() => setViewMode('trends')}
              className={`px-6 py-2 rounded-md transition-all ${
                viewMode === 'trends' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-100'
              }`}
            >
              📈 Trends
            </Button>
          </div>
        </motion.div>

        {/* Content based on view mode */}
        <AnimatePresence mode="wait">
          {viewMode === 'rankings' && (
            <motion.div
              key="rankings"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* Top 3 Winners */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🏆 Top 3 Winners</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {results.slice(0, 3).map((team, index) => {
                    const rankInfo = getRankBadge(team.rank);
                    return (
                      <motion.div
                        key={team.teamId}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                        onClick={() => handleTeamDetail(team)}
                      >
                        <Card className={`p-6 text-center transition-all duration-300 ${
                          index === 0 ? 'ring-4 ring-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100' :
                          index === 1 ? 'ring-4 ring-gray-400 bg-gradient-to-br from-gray-50 to-gray-100' :
                          'ring-4 ring-orange-400 bg-gradient-to-br from-orange-50 to-orange-100'
                        }`}>
                          <div className="text-6xl mb-4">{rankInfo.emoji}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{team.teamName}</h3>
                          <p className="text-gray-600 mb-4">{team.projectTitle}</p>
                          <Badge className={`${rankInfo.color} mb-4`}>
                            {rankInfo.label}
                          </Badge>
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {team.averageScore.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Total: {team.totalScore.toFixed(1)}/{team.maxScore}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* All Teams Rankings */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Complete Rankings</h2>
                <div className="space-y-4">
                  {results.map((team) => {
                    const rankInfo = getRankBadge(team.rank);
                    return (
                      <motion.div
                        key={team.teamId}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => handleTeamDetail(team)}
                      >
                        <Card className="p-6 hover:shadow-lg transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">{rankInfo.emoji}</div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">{team.teamName}</h3>
                                <p className="text-gray-600">{team.projectTitle}</p>
                                <p className="text-sm text-gray-500">Leader: {team.teamLeader}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{team.averageScore.toFixed(1)}</div>
                              <div className="text-sm text-gray-500">Average Score</div>
                              <Badge className={`mt-2 ${
                                team.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {team.status === 'completed' ? '✅ Complete' : '⏳ Pending'}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span>{((team.averageScore / 100) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(team.averageScore)}`}
                                style={{ width: `${(team.averageScore / 100) * 100}%` }}
                              />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {viewMode === 'analytics' && (
            <motion.div
              key="analytics"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Performance Analytics</h2>
              
              {/* Overall Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">{results.length}</div>
                  <div className="text-gray-600">Total Teams</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {results.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-gray-600">Completed</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {(results.reduce((sum, team) => sum + team.averageScore, 0) / results.length).toFixed(1)}
                  </div>
                  <div className="text-gray-600">Avg Score</div>
                </Card>
                <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {Math.max(...results.map(t => t.averageScore)).toFixed(1)}
                  </div>
                  <div className="text-gray-600">Highest Score</div>
                </Card>
              </div>

              {/* Performance Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {results.map((team) => (
                  <Card key={team.teamId} className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{team.teamName}</h3>
                    <div className="space-y-3">
                      {Object.entries(team.performance).map(([category, score]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-gray-600 capitalize">{category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getProgressColor(score)}`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getPerformanceColor(score)}`}>
                              {score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {viewMode === 'trends' && (
            <motion.div
              key="trends"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Evaluation Trends</h2>
              
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Score Distribution</h3>
                <div className="space-y-4">
                  {['90-100', '80-89', '70-79', '60-69', 'Below 60'].map((range, index) => {
                    const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
                    const count = results.filter(team => {
                      const score = team.averageScore;
                      if (range === '90-100') return score >= 90;
                      if (range === '80-89') return score >= 80 && score < 90;
                      if (range === '70-79') return score >= 70 && score < 80;
                      if (range === '60-69') return score >= 60 && score < 70;
                      return score < 60;
                    }).length;
                    
                    return (
                      <div key={range} className="flex items-center space-x-4">
                        <div className="w-20 text-sm text-gray-600">{range}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6">
                          <div 
                            className={`h-6 rounded-full ${colors[index]} transition-all duration-1000`}
                            style={{ width: `${(count / results.length) * 100}%` }}
                          />
                        </div>
                        <div className="w-16 text-sm text-gray-600 text-right">{count} teams</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedTeam && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTeam.teamName}</h2>
                    <p className="text-gray-600">{selectedTeam.projectTitle}</p>
                  </div>
                  <Button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </Button>
                </div>

                {/* Detailed Evaluation Breakdown */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {selectedTeam.averageScore.toFixed(1)}
                    </div>
                    <div className="text-gray-600">Overall Average Score</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedTeam.evaluations.map((evaluation, index) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{evaluation.evaluatorName}</h4>
                        {evaluation.score ? (
                          <div>
                            <div className="text-2xl font-bold text-blue-600 mb-3">{evaluation.score}/100</div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Problem Statement:</span>
                                <span className="font-medium">{evaluation.criteria.problemStatement}/25</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Team Involvement:</span>
                                <span className="font-medium">{evaluation.criteria.teamInvolvement}/25</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Lean Canvas:</span>
                                <span className="font-medium">{evaluation.criteria.leanCanvas}/25</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Prototype Quality:</span>
                                <span className="font-medium">{evaluation.criteria.prototypeQuality}/25</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Badge className="bg-yellow-100 text-yellow-800">
                              ⏳ Pending
                            </Badge>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FacultyResults;
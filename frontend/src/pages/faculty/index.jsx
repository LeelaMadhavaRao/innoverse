import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import FacultyLayout from '../../components/layout/faculty-layout';
import { useAuth } from '../../context/auth-context';
import { facultyAPI, adminAPI } from '../../lib/api';

function FacultyDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeams: 0,
    evaluatedTeams: 0,
    pendingEvaluations: 0,
    averageScore: 0
  });
  const [teams, setTeams] = useState([]);
  const [recentEvaluations, setRecentEvaluations] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      
      // Fetch teams data - try faculty API first, then admin API as fallback
      let teamsData = [];
      try {
        const teamsResponse = await facultyAPI.getTeams();
        teamsData = teamsResponse.data?.teams || teamsResponse.data || [];
      } catch (error) {
        console.log('Faculty API unavailable, trying admin API...');
        try {
          const teamsResponse = await adminAPI.getTeams();
          teamsData = teamsResponse.data?.teams || teamsResponse.data || [];
        } catch (adminError) {
          console.log('Admin API also unavailable, using fallback data');
          teamsData = [];
        }
      }
      
      setTeams(teamsData);

      // Calculate stats
      const totalTeams = teamsData.length;
      const evaluatedTeams = teamsData.filter(team => team.evaluationResults?.length > 0).length;
      const pendingEvaluations = totalTeams - evaluatedTeams;
      
      // Calculate average score
      let totalScore = 0;
      let scoreCount = 0;
      teamsData.forEach(team => {
        if (team.evaluationResults?.length > 0) {
          team.evaluationResults.forEach(result => {
            totalScore += result.totalScore || 0;
            scoreCount++;
          });
        }
      });
      const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;

      setStats({
        totalTeams,
        evaluatedTeams,
        pendingEvaluations,
        averageScore
      });

      // Set recent evaluations (last 5)
      const evaluations = [];
      teamsData.forEach(team => {
        if (team.evaluationResults?.length > 0) {
          team.evaluationResults.forEach(result => {
            evaluations.push({
              teamName: team.teamName,
              teamId: team._id,
              score: result.totalScore || 0,
              evaluated: true,
              date: result.evaluatedAt || result.createdAt,
              evaluator: result.evaluatorName
            });
          });
        } else {
          evaluations.push({
            teamName: team.teamName,
            teamId: team._id,
            score: 0,
            evaluated: false,
            date: team.createdAt,
            evaluator: null
          });
        }
      });

      // Sort by date and take the most recent 5
      evaluations.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentEvaluations(evaluations.slice(0, 5));

    } catch (error) {
      console.error('Error fetching faculty data:', error);
      // Fallback data for demo
      setStats({
        totalTeams: 32,
        evaluatedTeams: 18,
        pendingEvaluations: 14,
        averageScore: 78.5
      });
      
      setRecentEvaluations([
        { teamName: "InnovateTech", teamId: "1", score: 85, evaluated: true, date: "2025-09-06", evaluator: "Dr. Smith" },
        { teamName: "EcoSolutions", teamId: "2", score: 92, evaluated: true, date: "2025-09-06", evaluator: "Prof. Johnson" },
        { teamName: "HealthAI", teamId: "3", score: 0, evaluated: false, date: "2025-09-05", evaluator: null },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setShowTeamModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  if (loading) {
    return (
      <FacultyLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full"
          />
        </div>
      </FacultyLayout>
    );
  }

  return (
    <FacultyLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-x-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-cyan-900/30"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)"
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
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Faculty Portal
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Welcome, {user?.name}! Monitor team progress, conduct evaluations, and guide innovation at Innoverse 2025
              </p>
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl border border-purple-500/20 max-w-2xl mx-auto">
                <p className="text-purple-400">
                  🏛️ {user?.designation} | {user?.department}
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  title: "Total Teams",
                  value: stats.totalTeams,
                  icon: "👥",
                  color: "from-blue-500 to-purple-600",
                  bgColor: "from-blue-900/30 to-purple-900/30",
                  borderColor: "border-blue-500/20"
                },
                {
                  title: "Evaluated Teams",
                  value: stats.evaluatedTeams,
                  icon: "✅",
                  color: "from-emerald-500 to-teal-600",
                  bgColor: "from-emerald-900/30 to-teal-900/30",
                  borderColor: "border-emerald-500/20"
                },
                {
                  title: "Pending Evaluations",
                  value: stats.pendingEvaluations,
                  icon: "⏳",
                  color: "from-orange-500 to-red-600",
                  bgColor: "from-orange-900/30 to-red-900/30",
                  borderColor: "border-orange-500/20"
                },
                {
                  title: "Average Score",
                  value: `${stats.averageScore}%`,
                  icon: "📊",
                  color: "from-purple-500 to-pink-600",
                  bgColor: "from-purple-900/30 to-pink-900/30",
                  borderColor: "border-purple-500/20"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  className={`bg-gradient-to-br ${stat.bgColor} p-8 rounded-3xl border ${stat.borderColor} backdrop-blur-sm text-center`}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <h3 className="text-gray-300 font-medium">{stat.title}</h3>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    Team Management
                  </h3>
                  <div className="space-y-3">
                    <Link to="/faculty/teams">
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                        📋 View All Teams
                      </Button>
                    </Link>
                    <Button 
                      variant="outline"
                      className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10"
                      onClick={() => window.location.href = '/faculty/evaluations'}
                    >
                      ⭐ Evaluation Center
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                    <span className="text-2xl mr-3">📊</span>
                    Reports & Analytics
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline"
                      className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-600/10"
                    >
                      📈 Performance Reports
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-600/10"
                    >
                      📋 Evaluation History
                    </Button>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                    <span className="text-2xl mr-3">📅</span>
                    Upcoming Events
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-emerald-500 pl-4">
                      <h4 className="font-medium text-white">Final Presentations</h4>
                      <p className="text-gray-400 text-sm">September 17, 2025 - 10:00 AM</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-medium text-white">Results Announcement</h4>
                      <p className="text-gray-400 text-sm">September 17, 2025 - 4:00 PM</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Recent Teams Activity */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white flex items-center">
                    <span className="text-3xl mr-3">🏆</span>
                    Team Evaluations Dashboard
                  </h3>
                  <p className="text-gray-400 mt-2">Monitor and evaluate team progress in real-time</p>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700/50">
                          <th className="text-left py-4 px-4 text-emerald-400 font-semibold">Team Name</th>
                          <th className="text-left py-4 px-4 text-emerald-400 font-semibold">Score</th>
                          <th className="text-left py-4 px-4 text-emerald-400 font-semibold">Status</th>
                          <th className="text-left py-4 px-4 text-emerald-400 font-semibold">Evaluator</th>
                          <th className="text-left py-4 px-4 text-emerald-400 font-semibold">Date</th>
                          <th className="text-left py-4 px-4 text-emerald-400 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentEvaluations.map((evaluation, index) => (
                          <motion.tr 
                            key={index} 
                            className="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <td className="py-4 px-4">
                              <div className="font-medium text-white flex items-center">
                                <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></span>
                                {evaluation.teamName}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-emerald-400 font-semibold">
                                {evaluation.evaluated ? `${evaluation.score}/100` : 'Not Evaluated'}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge 
                                className={
                                  evaluation.evaluated 
                                    ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                                    : "bg-orange-600/20 text-orange-400 border-orange-500/30"
                                }
                              >
                                {evaluation.evaluated ? '✅ Evaluated' : '⏳ Pending'}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-gray-300">
                              {evaluation.evaluator || 'Not Assigned'}
                            </td>
                            <td className="py-4 px-4 text-gray-400">
                              {new Date(evaluation.date).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs"
                                  onClick={() => {
                                    // Find the team by ID and show details
                                    const team = teams.find(t => t._id === evaluation.teamId || t.teamName === evaluation.teamName);
                                    if (team) handleViewTeam(team);
                                  }}
                                >
                                  👁️ View
                                </Button>
                                {!evaluation.evaluated && (
                                  <Button 
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs"
                                    onClick={() => window.location.href = `/faculty/evaluate/${evaluation.teamId}`}
                                  >
                                    ⭐ Evaluate
                                  </Button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {recentEvaluations.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-xl font-semibold text-white mb-2">No Team Data Available</h3>
                      <p className="text-gray-400">Teams will appear here once they register for Innoverse 2025</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Team Details Modal */}
        <AnimatePresence>
          {showTeamModal && selectedTeam && (
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
                className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl"
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTeamModal(false)}
                  className="absolute top-4 right-4 bg-gray-700/80 backdrop-blur-sm text-white rounded-full p-2 hover:bg-gray-600/80 transition-all duration-200 z-20"
                >
                  ✕
                </motion.button>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto max-h-[90vh]">
                  <h2 className="text-3xl font-bold text-white mb-6 pr-12">
                    🏆 {selectedTeam.teamName} Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Team Info */}
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                      <h3 className="text-emerald-400 font-semibold mb-4 text-xl">📋 Team Information</h3>
                      <div className="space-y-3 text-gray-300">
                        <p><strong>Team Lead:</strong> {selectedTeam.teamLead || 'Not specified'}</p>
                        <p><strong>Members:</strong> {selectedTeam.teamMembers?.length || 0}</p>
                        <p><strong>Registration Date:</strong> {new Date(selectedTeam.createdAt).toLocaleDateString()}</p>
                        <p><strong>Email:</strong> {selectedTeam.email || 'Not provided'}</p>
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
                      <h3 className="text-purple-400 font-semibold mb-4 text-xl">🎯 Problem Statement</h3>
                      <p className="text-gray-300 leading-relaxed">
                        {selectedTeam.problemStatement || 'Problem statement not yet submitted'}
                      </p>
                    </div>
                  </div>

                  {/* Team Members */}
                  {selectedTeam.teamMembers && selectedTeam.teamMembers.length > 0 && (
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-6">
                      <h3 className="text-blue-400 font-semibold mb-4 text-xl">👥 Team Members</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedTeam.teamMembers.map((member, index) => (
                          <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                            <p className="font-medium text-white">{member.name}</p>
                            <p className="text-gray-400 text-sm">{member.email}</p>
                            <p className="text-gray-400 text-sm">{member.rollNumber}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evaluation Results */}
                  {selectedTeam.evaluationResults && selectedTeam.evaluationResults.length > 0 && (
                    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 mb-6">
                      <h3 className="text-orange-400 font-semibold mb-4 text-xl">📊 Evaluation Results</h3>
                      {selectedTeam.evaluationResults.map((result, index) => (
                        <div key={index} className="bg-gray-700/30 p-4 rounded-lg mb-4">
                          <div className="grid md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <span className="text-gray-400 text-sm">Problem Statement:</span>
                              <p className="text-white font-semibold">{result.problemStatement || 0}/25</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Team Involvement:</span>
                              <p className="text-white font-semibold">{result.teamInvolvement || 0}/25</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Lean Canvas:</span>
                              <p className="text-white font-semibold">{result.leanCanvas || 0}/25</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Prototype:</span>
                              <p className="text-white font-semibold">{result.prototype || 0}/25</p>
                            </div>
                          </div>
                          <div className="border-t border-gray-600 pt-3">
                            <p className="text-emerald-400 font-bold text-lg">
                              Total Score: {result.totalScore || 0}/100
                            </p>
                            <p className="text-gray-400 text-sm">
                              Evaluated by: {result.evaluatorName} on {new Date(result.evaluatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      onClick={() => window.location.href = `/faculty/evaluate/${selectedTeam._id}`}
                    >
                      ⭐ Evaluate Team
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
                      onClick={() => setShowTeamModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FacultyLayout>
  );
}

export default FacultyDashboard;

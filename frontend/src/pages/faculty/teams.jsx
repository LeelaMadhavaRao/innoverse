import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
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

const FacultyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);

  // Fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        let response;
        try {
          // Try faculty API first
          response = await facultyAPI.getAllTeams();
        } catch (error) {
          console.log('Faculty API failed, trying team API:', error.message);
          // Fallback to team API
          response = await teamAPI.getAllTeams();
        }

        console.log('Teams response:', response);
        
        // Handle different response structures
        let teamsData = [];
        if (response?.success && Array.isArray(response.data)) {
          teamsData = response.data;
        } else if (Array.isArray(response?.teams)) {
          teamsData = response.teams;
        } else if (Array.isArray(response)) {
          teamsData = response;
        }

        // Transform teams data to include evaluation status
        const processedTeams = teamsData.map((team, index) => ({
          id: team._id || team.id || `team-${index}`,
          name: team.teamName || team.name || `Team ${index + 1}`,
          leader: team.leader || team.teamLeader || 'Unknown',
          email: team.email || team.leaderEmail || '',
          members: team.members || team.teamMembers || [],
          idea: team.problemStatement || team.idea || team.projectIdea || 'No problem statement provided',
          evaluated: team.evaluated || false,
          score: team.score || team.totalScore || 0,
          submittedAt: team.createdAt || team.submittedAt || new Date(),
          evaluationResults: team.evaluationResults || []
        }));

        setTeams(processedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
        // Set fallback data
        setTeams([
          {
            id: 'team-1',
            name: 'Tech Innovators',
            leader: 'John Doe',
            email: 'john@example.com',
            members: ['John Doe', 'Jane Smith', 'Bob Johnson'],
            idea: 'AI-powered learning platform for personalized education',
            evaluated: true,
            score: 85,
            submittedAt: new Date('2024-01-15'),
            evaluationResults: [{
              problemStatement: 22,
              teamInvolvement: 20,
              leanCanvas: 21,
              prototype: 22
            }]
          },
          {
            id: 'team-2',
            name: 'Green Solutions',
            leader: 'Alice Wilson',
            email: 'alice@example.com',
            members: ['Alice Wilson', 'Charlie Brown', 'David Lee'],
            idea: 'Sustainable waste management system using IoT sensors',
            evaluated: false,
            score: 0,
            submittedAt: new Date('2024-01-16'),
            evaluationResults: []
          },
          {
            id: 'team-3',
            name: 'HealthTech Team',
            leader: 'Sarah Johnson',
            email: 'sarah@example.com',
            members: ['Sarah Johnson', 'Mike Davis', 'Emma Wilson'],
            idea: 'Remote patient monitoring app with real-time alerts',
            evaluated: true,
            score: 92,
            submittedAt: new Date('2024-01-17'),
            evaluationResults: [{
              problemStatement: 24,
              teamInvolvement: 23,
              leanCanvas: 22,
              prototype: 23
            }]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Filter teams based on search and status
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.leader.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.idea.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'evaluated' && team.evaluated) ||
                         (filterStatus === 'pending' && !team.evaluated);

    return matchesSearch && matchesStatus;
  });

  const handleViewTeam = (team) => {
    setSelectedTeam(team);
    setShowTeamModal(true);
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
                Teams Overview
              </h1>
              <p className="text-xl text-gray-300">
                Monitor and evaluate participating teams in Innoverse 2025
              </p>
            </motion.div>

            {/* Statistics */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { title: "Total Teams", value: teams.length, icon: "👥", color: "from-blue-500 to-purple-600" },
                { title: "Evaluated", value: teams.filter(t => t.evaluated).length, icon: "✅", color: "from-emerald-500 to-teal-600" },
                { title: "Pending", value: teams.filter(t => !t.evaluated).length, icon: "⏳", color: "from-orange-500 to-red-600" },
                { title: "Average Score", value: teams.filter(t => t.evaluated).length > 0 ? Math.round(teams.filter(t => t.evaluated).reduce((sum, t) => sum + t.score, 0) / teams.filter(t => t.evaluated).length) : 0, icon: "📊", color: "from-purple-500 to-pink-600" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-emerald-500/20 text-center`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full mx-auto mb-4 flex items-center justify-center text-2xl shadow-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <h3 className="text-gray-300 font-medium">{stat.title}</h3>
                </motion.div>
              ))}
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="🔍 Search teams, leaders, or ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-700/50 border-emerald-500/30 text-white placeholder-gray-400 focus:border-emerald-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={filterStatus === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('all')}
                        className={filterStatus === 'all' 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white" 
                          : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10"
                        }
                      >
                        All Teams
                      </Button>
                      <Button
                        variant={filterStatus === 'evaluated' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('evaluated')}
                        className={filterStatus === 'evaluated' 
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white" 
                          : "border-emerald-500/50 text-emerald-400 hover:bg-emerald-600/10"
                        }
                      >
                        Evaluated
                      </Button>
                      <Button
                        variant={filterStatus === 'pending' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('pending')}
                        className={filterStatus === 'pending' 
                          ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white" 
                          : "border-orange-500/50 text-orange-400 hover:bg-orange-600/10"
                        }
                      >
                        Pending
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Teams Grid */}
            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              {filteredTeams.map((team) => (
                <motion.div
                  key={team.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm">
                    <div className="p-6">
                      {/* Team Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 flex items-center">
                            <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></span>
                            {team.name}
                          </h3>
                          <p className="text-emerald-400 font-medium">👤 {team.leader}</p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              team.evaluated 
                                ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/30"
                                : "bg-orange-600/20 text-orange-400 border-orange-500/30"
                            }
                          >
                            {team.evaluated ? '✅ Evaluated' : '⏳ Pending'}
                          </Badge>
                          {team.evaluated && (
                            <div className="text-2xl font-bold text-emerald-400 mt-1">
                              {team.score}/100
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Team Info */}
                      <div className="mb-4">
                        <p className="text-gray-300 text-sm mb-2">
                          <strong className="text-white">👥 Members:</strong> {Array.isArray(team.members) ? team.members.length : team.members?.split(',').length || 0}
                        </p>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          <strong className="text-white">💡 Idea:</strong> {team.idea}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                        <Button
                          onClick={() => handleViewTeam(team)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                          👁️ View Details
                        </Button>
                        {!team.evaluated && (
                          <Button
                            onClick={() => window.location.href = `/faculty/evaluate/${team.id}`}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          >
                            ⭐ Evaluate
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* No Teams Message */}
            {filteredTeams.length === 0 && (
              <motion.div
                variants={itemVariants}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-semibold text-white mb-2">No Teams Found</h3>
                <p className="text-gray-400">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Teams will appear here once they register for Innoverse 2025'}
                </p>
              </motion.div>
            )}
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
                className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl"
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
                  <h2 className="text-3xl font-bold text-white mb-6 pr-12 flex items-center">
                    <span className="w-4 h-4 bg-emerald-400 rounded-full mr-4"></span>
                    {selectedTeam.name}
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Team Info */}
                    <Card className="bg-gray-800/50 border-emerald-500/20 p-6">
                      <h3 className="text-emerald-400 font-semibold mb-4 text-xl flex items-center">
                        <span className="text-2xl mr-3">📋</span>
                        Team Information
                      </h3>
                      <div className="space-y-3 text-gray-300">
                        <p><strong className="text-white">👤 Team Lead:</strong> {selectedTeam.leader}</p>
                        <p><strong className="text-white">👥 Total Members:</strong> {Array.isArray(selectedTeam.members) ? selectedTeam.members.length : selectedTeam.members?.split(',').length || 0}</p>
                        <p><strong className="text-white">📧 Email:</strong> {selectedTeam.email || 'Not provided'}</p>
                        <p><strong className="text-white">📅 Submitted:</strong> {new Date(selectedTeam.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </Card>

                    {/* Evaluation Status */}
                    <Card className="bg-gray-800/50 border-emerald-500/20 p-6">
                      <h3 className="text-purple-400 font-semibold mb-4 text-xl flex items-center">
                        <span className="text-2xl mr-3">📊</span>
                        Evaluation Status
                      </h3>
                      {selectedTeam.evaluated ? (
                        <div className="space-y-3">
                          <div className="text-center p-4 bg-emerald-900/30 rounded-lg border border-emerald-500/30">
                            <div className="text-3xl font-bold text-emerald-400 mb-1">
                              {selectedTeam.score}/100
                            </div>
                            <p className="text-emerald-300 text-sm">Overall Score</p>
                          </div>
                          {selectedTeam.evaluationResults?.[0] && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="p-2 bg-gray-700/30 rounded">
                                <span className="text-gray-400">Problem:</span>
                                <span className="text-white font-semibold ml-1">{selectedTeam.evaluationResults[0].problemStatement}/25</span>
                              </div>
                              <div className="p-2 bg-gray-700/30 rounded">
                                <span className="text-gray-400">Team:</span>
                                <span className="text-white font-semibold ml-1">{selectedTeam.evaluationResults[0].teamInvolvement}/25</span>
                              </div>
                              <div className="p-2 bg-gray-700/30 rounded">
                                <span className="text-gray-400">Canvas:</span>
                                <span className="text-white font-semibold ml-1">{selectedTeam.evaluationResults[0].leanCanvas}/25</span>
                              </div>
                              <div className="p-2 bg-gray-700/30 rounded">
                                <span className="text-gray-400">Prototype:</span>
                                <span className="text-white font-semibold ml-1">{selectedTeam.evaluationResults[0].prototype}/25</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-orange-900/30 rounded-lg border border-orange-500/30">
                          <div className="text-2xl mb-2">⏳</div>
                          <p className="text-orange-400">Evaluation Pending</p>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Problem Statement */}
                  <Card className="bg-gray-800/50 border-emerald-500/20 p-6 mb-6">
                    <h3 className="text-blue-400 font-semibold mb-4 text-xl flex items-center">
                      <span className="text-2xl mr-3">💡</span>
                      Problem Statement
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {selectedTeam.idea}
                    </p>
                  </Card>

                  {/* Team Members */}
                  {Array.isArray(selectedTeam.members) && selectedTeam.members.length > 0 && (
                    <Card className="bg-gray-800/50 border-emerald-500/20 p-6 mb-6">
                      <h3 className="text-emerald-400 font-semibold mb-4 text-xl flex items-center">
                        <span className="text-2xl mr-3">👥</span>
                        Team Members
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedTeam.members.map((member, index) => (
                          <div key={index} className="bg-gray-700/30 p-4 rounded-lg">
                            <p className="font-medium text-white">
                              {typeof member === 'string' ? member : member.name || `Member ${index + 1}`}
                            </p>
                            {typeof member === 'object' && (
                              <>
                                <p className="text-gray-400 text-sm">{member.email}</p>
                                <p className="text-gray-400 text-sm">{member.rollNumber}</p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {!selectedTeam.evaluated && (
                      <Button
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                        onClick={() => window.location.href = `/faculty/evaluate/${selectedTeam.id}`}
                      >
                        ⭐ Evaluate Team
                      </Button>
                    )}
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
};

export default FacultyTeams;

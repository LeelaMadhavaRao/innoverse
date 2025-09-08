import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select } from '../../components/ui/select';
import AdminLayout from '../../components/admin/admin-layout';

function AdminEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [evaluators, setEvaluators] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedEvaluator, setSelectedEvaluator] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    fetchEvaluations();
    fetchTeams();
    fetchEvaluators();
  }, []);

  const fetchEvaluations = async () => {
    try {
      // Mock evaluation data
      const mockEvaluations = [
        {
          id: 1,
          teamId: 1,
          teamName: "AI Innovators",
          evaluatorId: 1,
          evaluatorName: "Dr. Arjun Patel",
          submittedAt: "2025-01-15T10:30:00",
          status: "completed",
          scores: {
            innovation: 85,
            technical: 78,
            business: 82,
            presentation: 88,
            feasibility: 75
          },
          totalScore: 81.6,
          feedback: "Excellent innovative approach with strong technical foundation. Business model needs refinement.",
          rank: 2
        },
        {
          id: 2,
          teamId: 2,
          teamName: "EcoTech Solutions",
          evaluatorId: 2,
          evaluatorName: "Prof. Kavita Singh",
          submittedAt: "2025-01-15T11:45:00",
          status: "completed",
          scores: {
            innovation: 92,
            technical: 85,
            business: 89,
            presentation: 91,
            feasibility: 87
          },
          totalScore: 88.8,
          feedback: "Outstanding solution with clear market potential and excellent execution.",
          rank: 1
        },
        {
          id: 3,
          teamId: 3,
          teamName: "HealthTech Warriors",
          evaluatorId: 1,
          evaluatorName: "Dr. Arjun Patel",
          submittedAt: null,
          status: "pending",
          scores: null,
          totalScore: null,
          feedback: null,
          rank: null
        },
        {
          id: 4,
          teamId: 1,
          teamName: "AI Innovators",
          evaluatorId: 2,
          evaluatorName: "Prof. Kavita Singh",
          submittedAt: "2025-01-15T14:20:00",
          status: "completed",
          scores: {
            innovation: 88,
            technical: 82,
            business: 79,
            presentation: 85,
            feasibility: 80
          },
          totalScore: 82.8,
          feedback: "Strong technical solution with good innovation. Business strategy could be more detailed.",
          rank: 3
        }
      ];
      setEvaluations(mockEvaluations);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      // Mock teams data (updated to 10 teams total)
      const mockTeams = [
        { id: 1, name: "AI Innovators" },
        { id: 2, name: "EcoTech Solutions" },
        { id: 3, name: "HealthTech Warriors" },
        { id: 4, name: "FinTech Pioneers" },
        { id: 5, name: "EdTech Creators" },
        { id: 6, name: "AgriTech Innovators" },
        { id: 7, name: "CleanTech Visionaries" },
        { id: 8, name: "FoodTech Revolution" },
        { id: 9, name: "SpaceTech Explorers" },
        { id: 10, name: "CyberSec Guardians" }
      ];
      setTeams(mockTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchEvaluators = async () => {
    try {
      // Mock evaluators data (updated to 3 evaluators total)
      const mockEvaluators = [
        { id: 1, name: "Dr. Arjun Patel" },
        { id: 2, name: "Prof. Kavita Singh" },
        { id: 3, name: "Dr. Ravi Kumar" }
      ];
      setEvaluators(mockEvaluators);
    } catch (error) {
      console.error('Error fetching evaluators:', error);
    }
  };

  const getFilteredEvaluations = () => {
    return evaluations.filter(evaluation => {
      const teamMatch = selectedTeam === 'all' || evaluation.teamId.toString() === selectedTeam;
      const evaluatorMatch = selectedEvaluator === 'all' || evaluation.evaluatorId.toString() === selectedEvaluator;
      const statusMatch = selectedStatus === 'all' || evaluation.status === selectedStatus;
      return teamMatch && evaluatorMatch && statusMatch;
    });
  };

  const getTeamSummary = () => {
    const teamScores = {};
    evaluations.filter(e => e.status === 'completed').forEach(evaluation => {
      if (!teamScores[evaluation.teamId]) {
        teamScores[evaluation.teamId] = {
          teamName: evaluation.teamName,
          scores: [],
          totalEvaluations: 0,
          completedEvaluations: 0
        };
      }
      teamScores[evaluation.teamId].scores.push(evaluation.totalScore);
      teamScores[evaluation.teamId].completedEvaluations++;
    });

    // Add pending evaluations count
    evaluations.forEach(evaluation => {
      if (!teamScores[evaluation.teamId]) {
        teamScores[evaluation.teamId] = {
          teamName: evaluation.teamName,
          scores: [],
          totalEvaluations: 0,
          completedEvaluations: 0
        };
      }
      teamScores[evaluation.teamId].totalEvaluations++;
    });

    // Calculate averages and rank
    const teamSummary = Object.values(teamScores).map(team => ({
      ...team,
      averageScore: team.scores.length > 0 ? (team.scores.reduce((a, b) => a + b, 0) / team.scores.length).toFixed(1) : 'N/A',
      progress: `${team.completedEvaluations}/${team.totalEvaluations}`
    }));

    // Sort by average score (descending)
    return teamSummary.sort((a, b) => {
      if (a.averageScore === 'N/A') return 1;
      if (b.averageScore === 'N/A') return -1;
      return parseFloat(b.averageScore) - parseFloat(a.averageScore);
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const exportResults = () => {
    const teamSummary = getTeamSummary();
    const csvContent = [
      ['Rank', 'Team Name', 'Average Score', 'Evaluations Progress'],
      ...teamSummary.map((team, index) => [
        index + 1,
        team.teamName,
        team.averageScore,
        team.progress
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'innoverse-2025-evaluation-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Evaluation Dashboard
                </h1>
                <p className="text-gray-400 text-lg">
                  Monitor and analyze team evaluation scores for Innoverse 2025
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={exportResults}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                >
                  📊 Export Results
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Rankings Overview */}
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">🏆</span>
                  Team Rankings & Scores
                </h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {getTeamSummary().map((team, index) => (
                    <motion.div
                      key={team.teamName}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl border ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500/30' 
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-500/30'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-600/30'
                          : 'bg-gray-800/50 border-gray-600/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`text-2xl mr-4 ${
                            index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖️'
                          }`}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🎖️'}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{team.teamName}</h4>
                            <p className="text-gray-400">Rank #{index + 1}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            team.averageScore !== 'N/A' 
                              ? 'text-emerald-400' 
                              : 'text-gray-400'
                          }`}>
                            {team.averageScore !== 'N/A' ? `${team.averageScore}%` : 'N/A'}
                          </div>
                          <p className="text-gray-400 text-sm">
                            Progress: {team.progress}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div variants={itemVariants} className="mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Filter by Team
                    </label>
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="all">All Teams</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id.toString()}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Filter by Evaluator
                    </label>
                    <select
                      value={selectedEvaluator}
                      onChange={(e) => setSelectedEvaluator(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="all">All Evaluators</option>
                      {evaluators.map(evaluator => (
                        <option key={evaluator.id} value={evaluator.id.toString()}>{evaluator.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Detailed Evaluations */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Detailed Evaluations ({getFilteredEvaluations().length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid gap-6">
                  {getFilteredEvaluations().map((evaluation) => (
                    <motion.div
                      key={evaluation.id}
                      whileHover={{ scale: 1.01 }}
                      className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 p-6 rounded-xl border border-gray-600/30"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-1">
                            {evaluation.teamName}
                          </h4>
                          <p className="text-gray-400">
                            Evaluated by: {evaluation.evaluatorName}
                          </p>
                          {evaluation.submittedAt && (
                            <p className="text-gray-500 text-sm">
                              Submitted: {new Date(evaluation.submittedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {evaluation.totalScore && (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-emerald-400">
                                {evaluation.totalScore}%
                              </div>
                              <p className="text-gray-400 text-sm">Total Score</p>
                            </div>
                          )}
                          <Badge className={getStatusColor(evaluation.status)}>
                            {evaluation.status}
                          </Badge>
                        </div>
                      </div>

                      {evaluation.scores && (
                        <div className="mb-4">
                          <h5 className="text-white font-semibold mb-3">Score Breakdown:</h5>
                          <div className="grid md:grid-cols-5 gap-4">
                            {Object.entries(evaluation.scores).map(([category, score]) => (
                              <div key={category} className="text-center">
                                <div className="text-lg font-bold text-cyan-400">{score}%</div>
                                <div className="text-gray-400 text-sm capitalize">{category}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {evaluation.feedback && (
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                          <h5 className="text-white font-semibold mb-2">Evaluator Feedback:</h5>
                          <p className="text-gray-300">{evaluation.feedback}</p>
                        </div>
                      )}

                      {evaluation.status === 'pending' && (
                        <div className="bg-yellow-900/20 border border-yellow-600/30 p-4 rounded-lg">
                          <p className="text-yellow-400">
                            ⏳ Evaluation pending from {evaluation.evaluatorName}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {getFilteredEvaluations().length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No evaluations found</h3>
                    <p className="text-gray-400">
                      Try adjusting your filters or wait for evaluators to submit their assessments
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}

export default AdminEvaluations;

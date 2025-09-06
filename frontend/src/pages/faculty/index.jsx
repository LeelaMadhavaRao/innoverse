import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import FacultyLayout from '../../components/faculty/faculty-layout';

function FacultyDashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    evaluatedTeams: 0,
    pendingEvaluations: 0,
    averageScore: 0
  });
  const [recentEvaluations, setRecentEvaluations] = useState([]);

  useEffect(() => {
    // Fetch faculty stats and recent evaluations
    const fetchFacultyData = async () => {
      try {
        // This would be actual API calls
        setStats({
          totalTeams: 32,
          evaluatedTeams: 18,
          pendingEvaluations: 14,
          averageScore: 78.5
        });
        
        setRecentEvaluations([
          { teamName: "InnovateTech", score: 85, evaluated: true, date: "2025-09-06" },
          { teamName: "EcoSolutions", score: 92, evaluated: true, date: "2025-09-06" },
          { teamName: "HealthAI", score: 0, evaluated: false, date: "2025-09-05" },
        ]);
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      }
    };

    fetchFacultyData();
  }, []);

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
    <FacultyLayout>
      <div className="p-6 bg-gray-900 min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Faculty Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Monitor team progress and evaluations for Innoverse 2025
            </p>
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
                bgColor: "from-blue-900/30 to-purple-900/30"
              },
              {
                title: "Evaluated Teams",
                value: stats.evaluatedTeams,
                icon: "✅",
                color: "from-emerald-500 to-teal-600",
                bgColor: "from-emerald-900/30 to-teal-900/30"
              },
              {
                title: "Pending Evaluations",
                value: stats.pendingEvaluations,
                icon: "⏳",
                color: "from-orange-500 to-red-600",
                bgColor: "from-orange-900/30 to-red-900/30"
              },
              {
                title: "Average Score",
                value: `${stats.averageScore}%`,
                icon: "📊",
                color: "from-purple-500 to-pink-600",
                bgColor: "from-purple-900/30 to-pink-900/30"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${stat.bgColor} p-6 rounded-2xl border border-gray-700 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                </div>
                <h3 className="text-gray-300 font-medium">{stat.title}</h3>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  View All Teams
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Evaluation Reports
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Event Statistics
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">📅</span>
                Upcoming Events
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h4 className="font-medium text-white">Final Presentations</h4>
                  <p className="text-gray-400 text-sm">September 15, 2025 - 10:00 AM</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium text-white">Results Announcement</h4>
                  <p className="text-gray-400 text-sm">September 16, 2025 - 4:00 PM</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-medium text-white">Awards Ceremony</h4>
                  <p className="text-gray-400 text-sm">September 16, 2025 - 6:00 PM</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Evaluations */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Recent Team Evaluations
                </h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-300">Team Name</th>
                        <th className="text-left py-3 px-4 text-gray-300">Score</th>
                        <th className="text-left py-3 px-4 text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 text-gray-300">Date</th>
                        <th className="text-left py-3 px-4 text-gray-300">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEvaluations.map((evaluation, index) => (
                        <tr key={index} className="border-b border-gray-700/50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">{evaluation.teamName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-emerald-400 font-semibold">
                              {evaluation.evaluated ? `${evaluation.score}/100` : '-'}
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
                              {evaluation.evaluated ? 'Evaluated' : 'Pending'}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-400">
                            {new Date(evaluation.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <Button 
                              size="sm"
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              {evaluation.evaluated ? 'View' : 'Evaluate'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </FacultyLayout>
  );
}

export default FacultyDashboard;

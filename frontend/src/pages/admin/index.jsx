import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { adminAPI } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalFaculty: 0,
    totalEvaluators: 0,
    totalUsers: 0,
    totalPhotos: 0,
    totalEvaluations: 0,
    pendingEvaluations: 0,
    activeTeams: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      const { stats: fetchedStats, recentActivity: activity } = response.data;
      
      setStats(fetchedStats);
      setRecentActivity(activity || []);
      
      console.log('📊 Dashboard data loaded:', fetchedStats);
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Manage all aspects of Innoverse 2025 event
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {[
              {
                title: "Total Teams",
                value: loading ? "..." : stats.totalTeams,
                icon: "👥",
                color: "from-blue-500 to-purple-600",
                bgColor: "from-blue-900/30 to-purple-900/30"
              },
              {
                title: "Faculty Members",
                value: loading ? "..." : stats.totalFaculty,
                icon: "🎓",
                color: "from-purple-500 to-pink-600",
                bgColor: "from-purple-900/30 to-pink-900/30"
              },
              {
                title: "Evaluators",
                value: loading ? "..." : stats.totalEvaluators,
                icon: "⭐",
                color: "from-orange-500 to-red-600",
                bgColor: "from-orange-900/30 to-red-900/30"
              },
              {
                title: "Total Users",
                value: loading ? "..." : stats.totalUsers,
                icon: "🌐",
                color: "from-emerald-500 to-teal-600",
                bgColor: "from-emerald-900/30 to-teal-900/30"
              },
              {
                title: "Gallery Photos",
                value: loading ? "..." : stats.totalPhotos,
                icon: "📸",
                color: "from-cyan-500 to-blue-600",
                bgColor: "from-cyan-900/30 to-blue-900/30"
              },
              {
                title: "Evaluations Done",
                value: loading ? "..." : stats.totalEvaluations,
                icon: "📊",
                color: "from-green-500 to-emerald-600",
                bgColor: "from-green-900/30 to-emerald-900/30"
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

          {/* Quick Management Actions */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">👥</span>
                User Management
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Create Team Accounts
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Create Faculty Accounts
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  Create Evaluator Accounts
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">📊</span>
                Evaluations
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                >
                  View All Scores
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Export Results
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Generate Reports
                </Button>
              </div>
            </Card>

            <Card className="bg-gray-800 border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">🖼️</span>
                Event Media
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                >
                  Upload Event Photos
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Manage Gallery
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Approve Submissions
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { action: "New team registered", user: "InnovateTech", time: "2 minutes ago", type: "team" },
                    { action: "Photo uploaded to gallery", user: "Admin", time: "5 minutes ago", type: "gallery" },
                    { action: "Evaluation completed", user: "Dr. Smith", time: "15 minutes ago", type: "evaluation" },
                    { action: "Faculty account created", user: "Prof. Johnson", time: "1 hour ago", type: "faculty" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'team' ? 'bg-blue-600' :
                          activity.type === 'faculty' ? 'bg-purple-600' :
                          activity.type === 'evaluation' ? 'bg-orange-600' : 'bg-cyan-600'
                        }`}>
                          <span className="text-white text-sm font-bold">
                            {activity.type === 'team' ? '👥' :
                             activity.type === 'faculty' ? '🎓' :
                             activity.type === 'evaluation' ? '⭐' : '📸'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-gray-400 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
  );
}

export default AdminDashboard;

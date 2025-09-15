import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { evaluationAPI } from '../../lib/api';
import Navigation from '../../components/navigation';

const TeamEvaluation = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluatorInfo, setEvaluatorInfo] = useState(null);

  // Fetch teams data from API
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await evaluationAPI.getEvaluatorTeams();
        const { evaluator, teams: teamsList } = response.data;
        
        setEvaluatorInfo(evaluator);
        setTeams(teamsList);
        
        console.log('✅ Teams loaded:', teamsList.length, 'teams');
        console.log('✅ Evaluator info:', evaluator.name);
      } catch (error) {
        console.error('❌ Failed to load teams:', error);
        addToast({
          title: 'Error',
          description: 'Failed to load assigned teams. Please try again.',
          variant: 'destructive'
        });
        
        // Fallback to empty state
        setTeams([]);
        setEvaluatorInfo({ name: 'Evaluator', totalAssigned: 0, completed: 0, remaining: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [addToast]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Evaluated';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not evaluated';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center">
            <div className="text-4xl mb-4">⚖️</div>
            <p className="text-gray-300">Loading evaluation teams...</p>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Header */}
            <div className="text-center mb-8">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Team Evaluation
              </h1>
              <p className="text-gray-300">
                Evaluate assigned teams and their innovative projects
              </p>
            </div>

            {/* Evaluator Summary */}
            {evaluatorInfo && (
              <div className="mb-8">
                <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">
                        Welcome, {evaluatorInfo.name}
                      </h2>
                      <p className="text-gray-300">
                        You have {evaluatorInfo.totalAssigned} teams assigned for evaluation
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-emerald-400">{evaluatorInfo.totalAssigned}</div>
                        <div className="text-xs text-gray-400">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-teal-400">{evaluatorInfo.completed}</div>
                        <div className="text-xs text-gray-400">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-cyan-400">{evaluatorInfo.remaining}</div>
                        <div className="text-xs text-gray-400">Remaining</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Teams Grid */}
            {teams.length === 0 ? (
              <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Teams Assigned</h3>
                <p className="text-gray-300">
                  You don't have any teams assigned for evaluation yet. Please contact the admin if you believe this is an error.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <motion.div
                    key={team._id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {team.teamName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Leader: {team.teamLeader?.name || 'Not specified'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(team.evaluationStatus)}>
                          {getStatusText(team.evaluationStatus)}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Project</h4>
                          <p className="text-sm text-white">
                            {team.projectDetails?.projectTitle || 'Project title not available'}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-300">Description</h4>
                          <p className="text-sm text-gray-300 line-clamp-3">
                            {team.projectDetails?.description || 'No description available'}
                          </p>
                        </div>

                        {team.evaluationScore && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300">Score</h4>
                            <p className="text-lg font-bold text-emerald-400">
                              {team.evaluationScore}/100
                            </p>
                          </div>
                        )}

                        {team.evaluationDate && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-300">Evaluated On</h4>
                            <p className="text-sm text-gray-300">
                              {formatDate(team.evaluationDate)}
                            </p>
                          </div>
                        )}

                        <div className="pt-4">
                          {team.evaluationStatus === 'completed' ? (
                            <Button 
                              onClick={() => navigate(`/evaluator/evaluation/view/${team._id}`)}
                              className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                            >
                              👁️ View Evaluation
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => navigate(`/evaluator/evaluation/form/${team._id}`)}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              ⚖️ Start Evaluation
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeamEvaluation;
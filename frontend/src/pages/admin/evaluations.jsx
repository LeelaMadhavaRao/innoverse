import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { adminAPI, evaluationAPI } from '../../lib/api';

function AdminEvaluations() {
  const { addToast } = useToast();
  const [activeView, setActiveView] = useState('evaluators'); // evaluators | teams | results
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [resultsReleased, setResultsReleased] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluators, setEvaluators] = useState([]);
  const [teams, setTeams] = useState([]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Fetch evaluators and evaluation data
  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        setLoading(true);
        
        // Fetch evaluators
        const evaluatorsResponse = await adminAPI.getEvaluators();
        const evaluatorsData = evaluatorsResponse.data || [];
        
        // Fetch teams 
        const teamsResponse = await adminAPI.getTeams();
        const teamsData = teamsResponse.data || [];
        
        // Fetch evaluations overview
        const evaluationsResponse = await adminAPI.getEvaluations();
        const evaluationsData = evaluationsResponse.data || [];
        
        console.log('Fetched data:', { evaluatorsData, teamsData, evaluationsData });
        
        // Process evaluator data with evaluation statistics
        const processedEvaluators = evaluatorsData.map(evaluator => {
          const evaluatorEvaluations = evaluationsData.filter(evaluation => 
            evaluation && evaluation.evaluatorId === evaluator._id
          );
          const totalTeams = teamsData.length;
          const teamsEvaluated = evaluatorEvaluations.length;
          const avgScore = teamsEvaluated > 0 
            ? evaluatorEvaluations.reduce((sum, evaluation) => sum + (evaluation.totalScore || 0), 0) / teamsEvaluated 
            : 0;
          
          return {
            id: evaluator._id,
            name: evaluator.name,
            email: evaluator.email,
            organization: evaluator.organization || 'N/A',
            type: evaluator.type || 'academic',
            teamsEvaluated,
            totalTeams,
            avgScore: Math.round(avgScore * 10) / 10,
            completionRate: totalTeams > 0 ? Math.round((teamsEvaluated / totalTeams) * 100) : 0
          };
        });
        
        setEvaluators(processedEvaluators);
        setTeams(teamsData);
        
      } catch (error) {
        console.error('Error fetching evaluation data:', error);
        addToast({
          title: 'Error',
          description: 'Failed to load evaluation data. Using sample data.',
          type: 'destructive'
        });
        
        // Fallback to sample data
        setEvaluators([
          {
            id: 1,
            name: "Dr. Arjun Patel",
            email: "arjun@example.com",
            organization: "Tech Institute",
            type: "academic",
            teamsEvaluated: 8,
            totalTeams: 12,
            avgScore: 82.5,
            completionRate: 67
          },
          {
            id: 2,
            name: "Prof. Kavita Singh",
            email: "kavita@example.com", 
            organization: "Innovation Lab",
            type: "industry",
            teamsEvaluated: 12,
            totalTeams: 12,
            avgScore: 78.9,
            completionRate: 100
          },
          {
            id: 3,
            name: "Dr. Ravi Kumar",
            email: "ravi@example.com",
            organization: "Startup Accelerator",
            type: "external",
            teamsEvaluated: 10,
            totalTeams: 12,
            avgScore: 85.2,
            completionRate: 83
          }
        ]);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, [addToast]);

  const canReleaseResults = () => {
    return teams.every(team => {
      const teamEvaluations = team.evaluations || [];
      return teamEvaluations.every(evaluation => evaluation && evaluation.status === 'completed');
    });
  };

  const handleReleaseResults = async () => {
    if (!canReleaseResults()) {
      addToast({
        title: 'Cannot Release Results',
        description: 'All teams must be evaluated by all evaluators before releasing results.',
        type: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      // Call the release results API
      await adminAPI.releaseResults();
      setResultsReleased(true);
      addToast({
        title: 'Results Released!',
        description: 'Results have been successfully released to all participants.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error releasing results:', error);
      addToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to release results. Please try again.',
        type: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const totalEvaluations = teams.length * evaluators.length;
  const completedEvaluations = teams.reduce((sum, team) => {
    const teamEvaluations = team.evaluations || [];
    return sum + teamEvaluations.filter(evaluation => evaluation && evaluation.status === 'completed').length;
  }, 0);
  const overallProgress = totalEvaluations > 0 ? ((completedEvaluations / totalEvaluations) * 100).toFixed(1) : 0;

  return (
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
              Evaluation Management
            </h1>
            <p className="text-gray-400 text-lg">
              Monitor and manage evaluation progress for Innoverse 2025
            </p>
          </div>
          {canReleaseResults() && !resultsReleased && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleReleaseResults}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                {loading ? '🔄 Releasing...' : '🚀 Release Results'}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-2 border border-gray-700">
          <nav className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('evaluators')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                activeView === 'evaluators'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              👨‍⚖️ Evaluators
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('teams')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                activeView === 'teams'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              👥 Teams
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView('results')}
              className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                activeView === 'results'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              🏆 Results
            </motion.button>
          </nav>
        </div>
      </motion.div>

      {/* Content based on active view */}
      {activeView === 'evaluators' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {evaluators.map((evaluator) => (
              <motion.div
                key={evaluator.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer"
                onClick={() => setSelectedEvaluator(evaluator)}
              >
                <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {evaluator.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{evaluator.name}</h3>
                      <p className="text-gray-400 text-sm">{evaluator.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Organization:</span>
                      <span className="text-white font-medium">{evaluator.organization}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Type:</span>
                      <Badge variant="secondary" className="capitalize">
                        {evaluator.type}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Teams Evaluated:</span>
                      <span className="text-white font-medium">{evaluator.teamsEvaluated}/{evaluator.totalTeams}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Completion Rate:</span>
                      <span className="text-white font-medium">{evaluator.completionRate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Avg Score:</span>
                      <span className="text-white font-medium">{evaluator.avgScore}/25</span>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${evaluator.completionRate}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Teams View */}
      {activeView === 'teams' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team) => (
              <motion.div
                key={team.id}
                whileHover={{ scale: 1.01 }}
                className="cursor-pointer"
                onClick={() => setSelectedTeam(team)}
              >
                <Card className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{team.teamName}</h3>
                      <p className="text-gray-400">{team.projectTitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{(team.averageScore || 0).toFixed(1)}</div>
                      <div className="text-gray-500 text-sm">Avg Score</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Evaluations:</span>
                      <span className="text-white">{(team.evaluations || []).length} completed</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Score:</span>
                      <span className="text-white">{(team.totalScore || 0).toFixed(1)}/300</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Results View */}
      {activeView === 'results' && (
        <motion.div variants={itemVariants} className="space-y-6">
          <Card className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Final Results & Rankings</h2>
            
            {canReleaseResults() ? (
              <div className="space-y-4">
                {teams
                  .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
                  .map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-lg border-2 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300' :
                        index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' :
                        index === 2 ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300' :
                        'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold text-gray-700">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{team.teamName}</h3>
                            <p className="text-gray-600">{team.projectTitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">{(team.averageScore || 0).toFixed(1)}</div>
                          <div className="text-sm text-gray-500">Average Score</div>
                          <div className="text-xs text-gray-400">Total: {(team.totalScore || 0).toFixed(1)}/300</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-medium text-white mb-2">Evaluations in Progress</h3>
                <p className="text-gray-400 mb-4">Results will be available once all evaluations are completed</p>
                <div className="bg-gray-700 rounded-lg p-4 max-w-md mx-auto">
                  <div className="text-sm text-gray-300">
                    Progress: {completedEvaluations}/{totalEvaluations} evaluations completed
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: overallProgress + '%' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AdminEvaluations;
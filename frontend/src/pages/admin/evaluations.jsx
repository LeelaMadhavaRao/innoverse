import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { adminAPI, evaluationAPI } from '../../lib/api';
import AdminLayout from '../../components/admin/admin-layout';

function AdminEvaluations() {
  const { addToast } = useToast();
  const [activeView, setActiveView] = useState('evaluators'); // evaluators | teams | results
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [resultsReleased, setResultsReleased] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluators, setEvaluators] = useState([]);
  const [teams, setTeams] = useState([]);

  // Fetch evaluators and evaluation data
  useEffect(() => {
    const fetchEvaluationData = async () => {
      try {
        setLoading(true);
        
        // Fetch evaluators
        const evaluatorsResponse = await adminAPI.getEvaluators();
        const evaluatorsData = evaluatorsResponse.data;
        
        // Fetch teams 
        const teamsResponse = await adminAPI.getTeams();
        const teamsData = teamsResponse.data;
        
        // Fetch evaluations overview
        const evaluationsResponse = await adminAPI.getEvaluations();
        const evaluationsData = evaluationsResponse.data;
        
        // Process evaluator data with evaluation statistics
        const processedEvaluators = evaluatorsData.map(evaluator => {
          const evaluatorEvaluations = evaluationsData.filter(evaluation => evaluation.evaluatorId === evaluator._id);
          const totalTeams = teamsData.length;
          const teamsEvaluated = evaluatorEvaluations.length;
          const avgScore = teamsEvaluated > 0 
            ? evaluatorEvaluations.reduce((sum, evaluation) => sum + evaluation.totalScore, 0) / teamsEvaluated 
            : 0;
          
          return {
            id: evaluator._id,
            name: evaluator.name,
            email: evaluator.email,
            organization: evaluator.organization,
            type: evaluator.type || 'academic',
            teamsEvaluated,
            totalTeams,
            avgScore: Math.round(avgScore * 10) / 10,
            completionRate: Math.round((teamsEvaluated / totalTeams) * 100)
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
            teamsEvaluated: 5,
            totalTeams: 12,
            avgScore: 85.2,
            completionRate: 42
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluationData();
  }, [addToast]);

  const getEvaluatorTeams = (evaluatorId) => {
    return teams.map(team => {
      // Find evaluations for this team by this evaluator
      const evaluation = team.evaluations?.find(evaluation => evaluation.evaluatorId === evaluatorId) || {
        status: 'not_started',
        score: null,
        submittedAt: null
      };
      return {
        ...team,
        evaluation
      };
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_started': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '⏳';
      case 'not_started': return '📝';
      default: return '📝';
    }
  };

  const canReleaseResults = () => {
    return teams.every(team => 
      team.evaluations.every(evaluation => evaluation.status === 'completed')
    );
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
    return sum + team.evaluations.filter(evaluation => evaluation.status === 'completed').length;
  }, 0);
  const overallProgress = ((completedEvaluations / totalEvaluations) * 100).toFixed(1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluation Management</h1>
            <p className="text-gray-600">Monitor evaluation progress and manage results</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="px-4 py-2 text-lg">
              Progress: {overallProgress}%
            </Badge>
            {canReleaseResults() && !resultsReleased && (
              <Button
                onClick={handleReleaseResults}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
              >
                🚀 Release Results
              </Button>
            )}
            {resultsReleased && (
              <Badge className="bg-green-100 text-green-800 px-4 py-2 text-lg">
                ✅ Results Released
              </Badge>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveView('evaluators')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'evaluators'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👨‍⚖️ Evaluators
            </button>
            <button
              onClick={() => setActiveView('teams')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'teams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              👥 Teams
            </button>
            <button
              onClick={() => setActiveView('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeView === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏆 Results
            </button>
          </nav>
        </div>

        {/* Evaluators View */}
        {activeView === 'evaluators' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Evaluator Cards */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Evaluators</h2>
              <div className="space-y-4">
                {evaluators.map(evaluator => (
                  <motion.div
                    key={evaluator.id}
                    whileHover={{ scale: 1.02 }}
                    className={`cursor-pointer ${
                      selectedEvaluator?.id === evaluator.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedEvaluator(evaluator)}
                  >
                    <Card className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{evaluator.name}</h3>
                          <p className="text-sm text-gray-600">{evaluator.organization}</p>
                          <Badge className="mt-2">{evaluator.type}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {evaluator.completionRate}%
                          </div>
                          <div className="text-xs text-gray-500">Completion</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Teams Done:</span>
                          <span className="font-medium ml-1">{evaluator.teamsEvaluated}/{evaluator.totalTeams}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Score:</span>
                          <span className="font-medium ml-1">{evaluator.avgScore}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${evaluator.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Teams for Selected Evaluator */}
            <div className="lg:col-span-2">
              {selectedEvaluator ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Teams for {selectedEvaluator.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getEvaluatorTeams(selectedEvaluator.id).map(team => (
                      <Card key={team.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
                            <p className="text-sm text-gray-600">{team.projectTitle}</p>
                          </div>
                          <Badge className={getStatusColor(team.evaluation.status)}>
                            {getStatusIcon(team.evaluation.status)} {team.evaluation.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {team.evaluation.status === 'completed' && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-green-900">Score</span>
                              <span className="text-lg font-bold text-green-600">
                                {team.evaluation.score}/100
                              </span>
                            </div>
                            <div className="text-xs text-green-700 mt-1">
                              Submitted: {new Date(team.evaluation.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-center">
                  <div>
                    <div className="text-6xl mb-4">👨‍⚖️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Evaluator</h3>
                    <p className="text-gray-600">Click on an evaluator card to view their team assignments</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Teams View */}
        {activeView === 'teams' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map(team => (
                <motion.div
                  key={team.id}
                  whileHover={{ scale: 1.02 }}
                  className={`cursor-pointer ${
                    selectedTeam?.id === team.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedTeam(team)}
                >
                  <Card className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900">{team.teamName}</h3>
                      <p className="text-sm text-gray-600">{team.projectTitle}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {team.evaluations.map(evaluation => (
                        <div key={evaluation.evaluatorId} className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">{evaluation.evaluatorName}</span>
                          <Badge className={`${getStatusColor(evaluation.status)} text-xs`}>
                            {getStatusIcon(evaluation.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Progress</span>
                        <span className="text-sm text-gray-600">
                          {team.evaluations.filter(e => e.status === 'completed').length}/{team.evaluations.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(team.evaluations.filter(e => e.status === 'completed').length / team.evaluations.length) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Selected Team Details */}
            {selectedTeam && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedTeam.teamName} - Evaluation Details</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {selectedTeam.evaluations.map(evaluation => (
                    <Card key={evaluation.evaluatorId} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{evaluation.evaluatorName}</h3>
                          <Badge className={getStatusColor(evaluation.status)}>
                            {getStatusIcon(evaluation.status)} {evaluation.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {evaluation.status === 'completed' && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">{evaluation.score}</div>
                            <div className="text-xs text-gray-500">/ 100</div>
                          </div>
                        )}
                      </div>
                      
                      {evaluation.status === 'completed' && (
                        <div className="text-xs text-gray-600">
                          Submitted: {new Date(evaluation.submittedAt).toLocaleDateString()}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Results View */}
        {activeView === 'results' && (
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Results & Rankings</h2>
              
              {canReleaseResults() ? (
                <div className="space-y-4">
                  {teams
                    .sort((a, b) => b.averageScore - a.averageScore)
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
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className={`text-3xl font-bold ${
                              index === 0 ? 'text-yellow-600' :
                              index === 1 ? 'text-gray-600' :
                              index === 2 ? 'text-orange-600' :
                              'text-gray-400'
                            }`}>
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{team.teamName}</h3>
                              <p className="text-gray-600">{team.projectTitle}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">{team.averageScore.toFixed(1)}</div>
                            <div className="text-sm text-gray-500">Average Score</div>
                            <div className="text-xs text-gray-400">Total: {team.totalScore.toFixed(1)}/300</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⏳</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Evaluations in Progress</h3>
                  <p className="text-gray-600 mb-4">Results will be available once all evaluations are completed</p>
                  <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
                    <div className="text-sm text-gray-700">
                      Progress: {completedEvaluations}/{totalEvaluations} evaluations completed
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminEvaluations;
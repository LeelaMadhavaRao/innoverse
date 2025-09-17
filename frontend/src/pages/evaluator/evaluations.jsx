import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import { evaluationAPI } from '../../lib/api';
import { Calendar, Users, Trophy, Star, FileText, ClipboardCheck } from 'lucide-react';
import Navigation from '../../components/navigation';

export default function EvaluatorEvaluations() {
  const { addToast } = useToast();
  const [evaluationsData, setEvaluationsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const response = await evaluationAPI.getEvaluatorEvaluations();
        setEvaluationsData(response.data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
        
        // Provide helpful fallback data based on error type
        if (error.response?.status === 403) {
          addToast({
            title: 'Access Restricted',
            description: 'Backend deployment is in progress. Please try again later.',
            variant: 'destructive',
          });
          
          // Set fallback data for 403 error
          setEvaluationsData({
            evaluator: {
              name: 'Evaluator',
              email: 'evaluator@example.com',
              organization: 'Loading...'
            },
            evaluations: [],
            totalEvaluations: 0
          });
        } else {
          addToast({
            title: 'Error',
            description: 'Failed to fetch evaluations. Please try again.',
            variant: 'destructive',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-cyan-900/30"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-emerald-400 text-xl">Loading evaluations...</p>
          </div>
        </div>
      </div>
    );
  }

  const averageScore = evaluationsData?.evaluations?.length > 0 
    ? (evaluationsData.evaluations.reduce((sum, evaluation) => sum + evaluation.totalScore, 0) / evaluationsData.evaluations.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <Navigation />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-cyan-900/30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                My Evaluations
              </h1>
              <p className="text-slate-400">
                View and track your completed team evaluations
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400 text-sm font-medium">Total Evaluations</p>
                  <p className="text-3xl font-bold text-white">
                    {evaluationsData?.totalEvaluations || 0}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 border-teal-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-400 text-sm font-medium">Average Score</p>
                  <div className="flex items-center">
                    <span className="text-3xl font-bold text-white">{averageScore}</span>
                    <span className="text-teal-400 ml-1">/100</span>
                  </div>
                </div>
                <Trophy className="w-8 h-8 text-teal-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/20 backdrop-blur-sm">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 text-sm font-medium">Evaluator</p>
                  <p className="text-lg font-semibold text-white truncate">
                    {evaluationsData?.evaluator?.name || 'N/A'}
                  </p>
                  <p className="text-cyan-300 text-sm">
                    {evaluationsData?.evaluator?.organization || 'N/A'}
                  </p>
                </div>
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Evaluation History
            </h2>
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {evaluationsData?.evaluations?.length || 0} evaluations
            </Badge>
          </div>

          {!evaluationsData?.evaluations?.length ? (
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-600/30 backdrop-blur-sm">
              <div className="p-12 text-center">
                <ClipboardCheck className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No evaluations yet</h3>
                <p className="text-slate-500">
                  You haven't completed any team evaluations yet. Check your assigned teams to get started.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6">
              {evaluationsData.evaluations.map((evaluation, index) => (
                <motion.div
                  key={evaluation._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-600/30 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-white mr-3">
                              {evaluation.teamName}
                            </h3>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              {evaluation.status}
                            </Badge>
                          </div>
                          <p className="text-slate-400 mb-2">
                            Team Leader: {evaluation.teamLeader}
                          </p>
                          <div className="flex items-center text-slate-500 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Evaluated on {new Date(evaluation.submittedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-4 lg:mt-0 lg:ml-6">
                          <div className="text-center bg-gradient-to-br from-emerald-900/50 to-teal-900/50 rounded-xl p-4 border border-emerald-500/20">
                            <div className="flex items-center justify-center mb-1">
                              <Star className="w-5 h-5 text-emerald-400 mr-1" />
                              <span className="text-2xl font-bold text-emerald-400">
                                {evaluation.totalScore.toFixed(1)}
                              </span>
                              <span className="text-emerald-300 ml-1">/100</span>
                            </div>
                            <p className="text-emerald-300 text-sm">Total Score</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-700/50 pt-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-3">Criteria Breakdown</h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">
                              {evaluation.criteria.problemStatement}
                            </p>
                            <p className="text-slate-400 text-sm">Problem Statement</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">
                              {evaluation.criteria.teamInvolvement}
                            </p>
                            <p className="text-slate-400 text-sm">Team Involvement</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">
                              {evaluation.criteria.leanCanvas}
                            </p>
                            <p className="text-slate-400 text-sm">Lean Canvas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">
                              {evaluation.criteria.prototypeQuality}
                            </p>
                            <p className="text-slate-400 text-sm">Prototype Quality</p>
                          </div>
                        </div>
                      </div>

                      {evaluation.feedback && (
                        <div className="border-t border-slate-700/50 pt-4 mt-4">
                          <h4 className="text-sm font-medium text-slate-300 mb-2">Feedback</h4>
                          <p className="text-slate-400 text-sm leading-relaxed">
                            {evaluation.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
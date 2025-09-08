import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { teamAPI } from '../../lib/api';
import { useAuth } from '../../context/auth-context';
import Navigation from '../../components/navigation';

function TeamResults() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await teamAPI.getResults();
      setResults(response.data || []);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      // Mock data for demonstration
      setResults([
        {
          id: '1',
          evaluationTitle: 'Project Presentation',
          score: 87,
          maxScore: 100,
          feedback: 'Excellent presentation with clear problem statement and innovative solution. Great team coordination.',
          evaluatedAt: '2025-09-01T10:00:00Z',
          evaluatorName: 'Dr. Sarah Johnson',
          category: 'Presentation',
          criteria: [
            { name: 'Innovation', score: 9, maxScore: 10 },
            { name: 'Technical Implementation', score: 8, maxScore: 10 },
            { name: 'Market Potential', score: 9, maxScore: 10 },
            { name: 'Team Collaboration', score: 8, maxScore: 10 }
          ]
        },
        {
          id: '2',
          evaluationTitle: 'Technical Review',
          score: 92,
          maxScore: 100,
          feedback: 'Outstanding technical implementation with solid architecture and scalable design.',
          evaluatedAt: '2025-09-03T14:30:00Z',
          evaluatorName: 'Prof. Michael Chen',
          category: 'Technical',
          criteria: [
            { name: 'Code Quality', score: 9, maxScore: 10 },
            { name: 'Architecture Design', score: 10, maxScore: 10 },
            { name: 'Security Implementation', score: 9, maxScore: 10 },
            { name: 'Performance Optimization', score: 9, maxScore: 10 }
          ]
        },
        {
          id: '3',
          evaluationTitle: 'Business Model',
          score: 78,
          maxScore: 100,
          feedback: 'Good business model but needs more detailed market analysis and financial projections.',
          evaluatedAt: '2025-09-05T16:15:00Z',
          evaluatorName: 'Dr. Emily Roberts',
          category: 'Business',
          criteria: [
            { name: 'Market Analysis', score: 7, maxScore: 10 },
            { name: 'Revenue Model', score: 8, maxScore: 10 },
            { name: 'Competitive Analysis', score: 8, maxScore: 10 },
            { name: 'Financial Projections', score: 7, maxScore: 10 }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (percentage >= 80) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (percentage >= 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (percentage >= 60) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Presentation': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Technical': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Business': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Innovation': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Design': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const overallScore = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) / results.length)
    : 0;

  const totalEvaluations = results.length;
  const averageScore = overallScore;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-teal-900/30"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/30 mb-6 px-4 py-2 text-lg">
                Team Results
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Your
              </span>
              <br />
              <span className="text-white">Performance</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-300"
            >
              Track your evaluation scores, receive detailed feedback, and monitor your progress in the competition.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Performance Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
            >
              📊 Performance Overview
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <motion.div
                variants={fadeInUp}
                whileHover={cardHover.hover}
                initial={cardHover.rest}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 text-center"
              >
                <div className="text-4xl mb-4">🎯</div>
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(averageScore, 100)}`}>
                  {averageScore}%
                </div>
                <div className="text-gray-400">Overall Score</div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={cardHover.hover}
                initial={cardHover.rest}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 text-center"
              >
                <div className="text-4xl mb-4">📝</div>
                <div className="text-4xl font-bold text-blue-400 mb-2">{totalEvaluations}</div>
                <div className="text-gray-400">Evaluations</div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={cardHover.hover}
                initial={cardHover.rest}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8 text-center"
              >
                <div className="text-4xl mb-4">🏆</div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">#42</div>
                <div className="text-gray-400">Current Rank</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Results */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-8xl mb-6">📈</div>
              <h3 className="text-2xl font-bold text-gray-400 mb-4">No Results Yet</h3>
              <p className="text-gray-500 mb-8">Your evaluation results will appear here once evaluators review your submissions.</p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                📤 Submit Project
              </Button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              >
                📋 Detailed Results
              </motion.h2>

              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  variants={fadeInUp}
                  whileHover={cardHover.hover}
                  initial={cardHover.rest}
                  className="group cursor-pointer"
                  onClick={() => setSelectedResult(result)}
                >
                  <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-700/50 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-purple-500/50 p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                            {result.evaluationTitle}
                          </h3>
                          <Badge className={`${getCategoryColor(result.category)} border`}>
                            {result.category}
                          </Badge>
                        </div>
                        <p className="text-gray-400">Evaluated by {result.evaluatorName}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold mb-1 ${getScoreColor(result.score, result.maxScore)}`}>
                          {result.score}/{result.maxScore}
                        </div>
                        <Badge className={`${getScoreBadgeColor(result.score, result.maxScore)} border`}>
                          {Math.round((result.score / result.maxScore) * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-2">Feedback:</h4>
                      <p className="text-gray-300 leading-relaxed">{result.feedback}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {result.criteria?.map((criterion, criterionIndex) => (
                        <div key={criterionIndex} className="bg-gray-800/50 p-3 rounded-xl text-center">
                          <div className="text-sm text-gray-400 mb-1">{criterion.name}</div>
                          <div className={`text-lg font-bold ${getScoreColor(criterion.score, criterion.maxScore)}`}>
                            {criterion.score}/{criterion.maxScore}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>📅 {new Date(result.evaluatedAt).toLocaleDateString()} at {new Date(result.evaluatedAt).toLocaleTimeString()}</span>
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-purple-400 font-medium">View Details →</span>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

export default TeamResults;

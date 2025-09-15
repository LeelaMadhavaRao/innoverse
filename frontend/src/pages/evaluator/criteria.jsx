import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';

const EvaluationCriteria = () => {
  const navigate = useNavigate();

  const criteriaData = [
    {
      id: 1,
      title: "Problem Statement",
      weight: "25%",
      maxScore: 25,
      icon: "🎯",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      description: "Evaluate the innovation, relevance, and clarity of the problem being addressed",
      subCriteria: [
        "Innovation and uniqueness of the problem approach",
        "Relevance and impact of the problem in real-world scenarios",
        "Clear articulation and understanding of the problem statement",
        "Market need and potential user base identification",
        "Feasibility of the proposed solution approach"
      ]
    },
    {
      id: 2,
      title: "Team Involvement",
      weight: "25%",
      maxScore: 25,
      icon: "👥",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      description: "Assess collaboration, participation, and team dynamics",
      subCriteria: [
        "Equal participation and contribution from all team members",
        "Effective collaboration and communication within the team",
        "Clear role distribution and responsibility allocation",
        "Team coordination and project management skills",
        "Conflict resolution and decision-making processes"
      ]
    },
    {
      id: 3,
      title: "Lean Canvas Model",
      weight: "25%",
      maxScore: 25,
      icon: "📊",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      description: "Review business model viability and market understanding",
      subCriteria: [
        "Comprehensive understanding of target customer segments",
        "Clear value proposition and unique selling points",
        "Realistic revenue streams and cost structure analysis",
        "Competitive analysis and market positioning",
        "Go-to-market strategy and implementation plan"
      ]
    },
    {
      id: 4,
      title: "Prototype Quality",
      weight: "25%",
      maxScore: 25,
      icon: "⚙️",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      description: "Evaluate technical implementation and functionality",
      subCriteria: [
        "Technical sophistication and implementation quality",
        "User interface design and user experience",
        "Functionality demonstration and feature completeness",
        "Code quality, documentation, and maintainability",
        "Innovation in technical approach and tools used"
      ]
    }
  ];

  const scoringScale = [
    { range: "9-10", label: "Excellent", description: "Outstanding work that exceeds all expectations", color: "text-green-600 bg-green-50" },
    { range: "7-8", label: "Very Good", description: "Exceeds expectations with minor areas for improvement", color: "text-blue-600 bg-blue-50" },
    { range: "5-6", label: "Good", description: "Meets expectations with room for enhancement", color: "text-yellow-600 bg-yellow-50" },
    { range: "3-4", label: "Fair", description: "Below expectations, needs significant improvement", color: "text-orange-600 bg-orange-50" },
    { range: "1-2", label: "Poor", description: "Poor performance, major improvements required", color: "text-red-600 bg-red-50" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/evaluator')}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                ← Back
              </button>
              <div className="flex-shrink-0">
                <img
                  className="h-12 w-12"
                  src="/innoverse_logo.jpg"
                  alt="Innoverse"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Evaluation Criteria</h1>
                <p className="text-sm text-gray-500">Guidelines for fair and consistent evaluation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => navigate('/evaluator')}
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              🏠 Home
            </button>
            <button
              onClick={() => navigate('/evaluator/profile')}
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              👤 Profile
            </button>
            <button
              onClick={() => navigate('/evaluator/criteria')}
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
            >
              📊 Evaluation Criteria
            </button>
            <button
              onClick={() => navigate('/evaluator/evaluation')}
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              ⚖️ Evaluation
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Overview */}
          <Card className="p-8 mb-8">
            <div className="text-center">
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
                📋
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Evaluation Framework</h2>
              <p className="text-lg text-gray-600 mb-6">
                Comprehensive guidelines to ensure fair and consistent evaluation of all team projects
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-gray-900">Total Score</h3>
                  <p className="text-2xl font-bold text-blue-600">100 Points</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="text-3xl mb-2">⚖️</div>
                  <h3 className="font-semibold text-gray-900">Equal Weight</h3>
                  <p className="text-2xl font-bold text-green-600">25% Each</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-gray-900">Criteria Count</h3>
                  <p className="text-2xl font-bold text-purple-600">4 Areas</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Criteria */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {criteriaData.map((criteria, index) => (
              <motion.div
                key={criteria.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`p-6 bg-gradient-to-br ${criteria.bgColor} border-l-4 border-l-current`}>
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{criteria.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{criteria.title}</h3>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${criteria.color}`}>
                          {criteria.weight}
                        </span>
                        <span className="text-sm text-gray-600">
                          Max: {criteria.maxScore} points
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{criteria.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Focus Areas:</h4>
                    <ul className="space-y-2">
                      {criteria.subCriteria.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Scoring Scale */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Scoring Scale & Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {scoringScale.map((scale, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${scale.color} text-center`}
                >
                  <div className="text-2xl font-bold mb-2">{scale.range}</div>
                  <div className="font-semibold mb-2">{scale.label}</div>
                  <div className="text-xs">{scale.description}</div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Evaluation Tips */}
          <Card className="p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Evaluation Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Do's</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Be objective and consistent across all teams</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Provide constructive feedback for improvement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Consider the team's approach and effort</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Focus on the criteria and subcriteria</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">Document your reasoning clearly</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">❌ Don'ts</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-gray-700">Let personal bias influence your scoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-gray-700">Compare teams against each other directly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-gray-700">Rush through evaluations without proper review</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-gray-700">Score based on presentation skills alone</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-gray-700">Provide vague or unhelpful feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EvaluationCriteria;
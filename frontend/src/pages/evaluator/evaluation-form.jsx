import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';

const TeamEvaluationForm = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  const isEditing = searchParams.get('edit') === 'true';
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Mock team data - in real app this would come from API
  const [teamData] = useState({
    id: parseInt(teamId),
    teamName: "Tech Innovators",
    teamLeader: { name: "John Smith", email: "john@example.com" },
    teamMembers: ["John Smith", "Sarah Johnson", "Mike Chen", "Lisa Davis"],
    projectTitle: "AI-Powered Learning Platform",
    description: "An innovative platform that uses AI to personalize learning experiences for students, adapting to individual learning styles and providing real-time feedback.",
    projectDetails: {
      technology: "React, Node.js, Python, TensorFlow",
      duration: "6 months",
      targetUsers: "Students, Educators",
      marketSize: "$50B education technology market"
    }
  });

  const [scores, setScores] = useState({
    problemStatement: { score: '', feedback: '' },
    teamInvolvement: { score: '', feedback: '' },
    leanCanvas: { score: '', feedback: '' },
    prototypeQuality: { score: '', feedback: '' }
  });

  const criteria = [
    {
      id: 'problemStatement',
      title: 'Problem Statement',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      description: 'Evaluate the innovation, relevance, and clarity of the problem being addressed',
      maxScore: 25,
      guidelines: [
        'Innovation and uniqueness of the approach (5 points)',
        'Relevance and real-world impact (5 points)',
        'Clear problem articulation (5 points)',
        'Market need identification (5 points)',
        'Solution feasibility (5 points)'
      ]
    },
    {
      id: 'teamInvolvement',
      title: 'Team Involvement',
      icon: '👥',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      description: 'Assess collaboration, participation, and team dynamics',
      maxScore: 25,
      guidelines: [
        'Equal participation from all members (5 points)',
        'Effective collaboration and communication (5 points)',
        'Clear role distribution (5 points)',
        'Team coordination skills (5 points)',
        'Conflict resolution and decision-making (5 points)'
      ]
    },
    {
      id: 'leanCanvas',
      title: 'Lean Canvas Model',
      icon: '📊',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      description: 'Review business model viability and market understanding',
      maxScore: 25,
      guidelines: [
        'Customer segment understanding (5 points)',
        'Clear value proposition (5 points)',
        'Revenue model and cost structure (5 points)',
        'Competitive analysis (5 points)',
        'Go-to-market strategy (5 points)'
      ]
    },
    {
      id: 'prototypeQuality',
      title: 'Prototype Quality',
      icon: '⚙️',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      description: 'Evaluate technical implementation and functionality',
      maxScore: 25,
      guidelines: [
        'Technical sophistication (5 points)',
        'User interface and experience (5 points)',
        'Functionality demonstration (5 points)',
        'Code quality and documentation (5 points)',
        'Innovation in technical approach (5 points)'
      ]
    }
  ];

  const handleScoreChange = (criteriaId, value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 25) return;
    
    setScores(prev => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], score: value }
    }));
  };

  const handleFeedbackChange = (criteriaId, value) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: { ...prev[criteriaId], feedback: value }
    }));
  };

  const getCurrentCriteria = () => criteria[currentStep];
  const currentCriteria = getCurrentCriteria();

  const isCurrentStepComplete = () => {
    if (!currentCriteria) return false;
    const currentScore = scores[currentCriteria.id];
    return currentScore.score !== '' && currentScore.feedback.trim() !== '';
  };

  const handleNext = () => {
    if (currentStep < criteria.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all scores are filled
    const missingScores = criteria.filter(c => !scores[c.id].score || !scores[c.id].feedback.trim());
    if (missingScores.length > 0) {
      addToast({
        title: 'Incomplete Evaluation',
        description: `Please complete evaluation for: ${missingScores.map(c => c.title).join(', ')}`,
        type: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addToast({
        title: 'Success',
        description: 'Team evaluation submitted successfully!',
        type: 'success'
      });
      
      navigate('/evaluator/evaluation');
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to submit evaluation. Please try again.',
        type: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const totalScore = Object.values(scores).reduce((sum, score) => {
    return sum + (parseInt(score.score) || 0);
  }, 0);

  const progress = ((currentStep + 1) / criteria.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/evaluator/evaluation')}
                className="mr-4 text-gray-400 hover:text-gray-600"
              >
                ← Back to Teams
              </button>
              <div className="flex-shrink-0">
                <img
                  className="h-12 w-12"
                  src="/innoverse_logo.jpg"
                  alt="Innoverse"
                />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Evaluation' : 'Team Evaluation'}
                </h1>
                <p className="text-sm text-gray-500">{teamData.teamName} - {teamData.projectTitle}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">Total Score: {totalScore}/100</p>
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {criteria.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Evaluation Progress</span>
              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {criteria.map((criteria, index) => (
                <div
                  key={criteria.id}
                  className={`text-xs font-medium ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  {criteria.icon} {criteria.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Team Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Team Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{teamData.teamName}</h4>
                  <p className="text-sm text-gray-600">Led by {teamData.teamLeader.name}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project</h4>
                  <p className="text-sm text-gray-800 font-medium">{teamData.projectTitle}</p>
                  <p className="text-sm text-gray-600 mt-1">{teamData.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Team Members</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {teamData.teamMembers.map((member, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Project Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Technology:</span> {teamData.projectDetails.technology}</p>
                    <p><span className="font-medium">Duration:</span> {teamData.projectDetails.duration}</p>
                    <p><span className="font-medium">Target Users:</span> {teamData.projectDetails.targetUsers}</p>
                    <p><span className="font-medium">Market Size:</span> {teamData.projectDetails.marketSize}</p>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Current Scores</h4>
                  <div className="space-y-2">
                    {criteria.map(criteria => (
                      <div key={criteria.id} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{criteria.title}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {scores[criteria.id].score || '-'}/25
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg text-blue-600">{totalScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Evaluation Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`p-8 bg-gradient-to-br ${currentCriteria.bgColor}`}>
                <div className="flex items-center mb-6">
                  <div className="text-5xl mr-4">{currentCriteria.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentCriteria.title}</h2>
                    <p className="text-gray-600">{currentCriteria.description}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      Maximum Score: {currentCriteria.maxScore} points
                    </p>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="mb-8 p-4 bg-white/50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Evaluation Guidelines</h3>
                  <ul className="space-y-2">
                    {currentCriteria.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-sm text-gray-700">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Score Input */}
                <div className="mb-6">
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    Score (0-{currentCriteria.maxScore} points)
                  </label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min="0"
                      max={currentCriteria.maxScore}
                      value={scores[currentCriteria.id].score}
                      onChange={(e) => handleScoreChange(currentCriteria.id, e.target.value)}
                      className="w-32 text-xl font-bold text-center"
                      placeholder="0"
                    />
                    <span className="text-gray-600">/ {currentCriteria.maxScore}</span>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 bg-gradient-to-r ${currentCriteria.color}`}
                          style={{ 
                            width: `${(parseInt(scores[currentCriteria.id].score) || 0) / currentCriteria.maxScore * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-900 mb-3">
                    Detailed Feedback & Comments
                  </label>
                  <textarea
                    value={scores[currentCriteria.id].feedback}
                    onChange={(e) => handleFeedbackChange(currentCriteria.id, e.target.value)}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={`Provide specific feedback for ${currentCriteria.title.toLowerCase()}. Include strengths, areas for improvement, and specific recommendations...`}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Character count: {scores[currentCriteria.id].feedback.length}/500 (recommended)
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2"
                  >
                    <span>← Previous</span>
                  </Button>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      {isCurrentStepComplete() ? '✅ Complete' : '⏳ In Progress'}
                    </div>
                    
                    {currentStep < criteria.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        disabled={!isCurrentStepComplete()}
                        className={`bg-gradient-to-r ${currentCriteria.color} text-white`}
                      >
                        Next →
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSubmit}
                        disabled={loading || !isCurrentStepComplete()}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                      >
                        {loading ? '⏳ Submitting...' : '✅ Submit Evaluation'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamEvaluationForm;
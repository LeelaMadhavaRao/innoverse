import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import AdminLayout from '../../components/admin/admin-layout';

function AdminEvaluators() {
  const [evaluators, setEvaluators] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEvaluator, setNewEvaluator] = useState({
    name: '',
    email: '',
    organization: '',
    expertise: '',
    experience: '',
    role: 'internal' // internal or external
  });

  useEffect(() => {
    fetchEvaluators();
  }, []);

  const fetchEvaluators = async () => {
    try {
      // Mock data - replace with actual API call
      const mockEvaluators = [
        {
          id: 1,
          name: "Dr. Arjun Patel",
          email: "arjun.patel@techcorp.com",
          organization: "TechCorp Industries",
          expertise: "AI/ML, Startup Evaluation",
          experience: "15+ years",
          role: "external",
          status: "active",
          teamsAssigned: 5,
          evaluationsCompleted: 3,
          createdAt: "2025-09-01"
        },
        {
          id: 2,
          name: "Prof. Kavita Singh",
          email: "kavita.singh@university.edu",
          organization: "University Incubator",
          expertise: "Business Strategy, Innovation",
          experience: "12+ years",
          role: "internal",
          status: "active",
          teamsAssigned: 4,
          evaluationsCompleted: 4,
          createdAt: "2025-09-02"
        }
      ];
      setEvaluators(mockEvaluators);
    } catch (error) {
      console.error('Error fetching evaluators:', error);
    }
  };

  const handleCreateEvaluator = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create evaluator account
      const evaluatorData = {
        name: newEvaluator.name,
        email: newEvaluator.email,
        password: generatePassword(),
        role: 'evaluator',
        evaluatorDetails: {
          organization: newEvaluator.organization,
          expertise: newEvaluator.expertise,
          experience: newEvaluator.experience,
          type: newEvaluator.role
        }
      };

      // This would be actual API calls
      console.log('Creating evaluator:', evaluatorData);
      
      // Send invitation email
      await sendEvaluatorInvitation(evaluatorData);
      
      // Reset form
      setNewEvaluator({
        name: '',
        email: '',
        organization: '',
        expertise: '',
        experience: '',
        role: 'internal'
      });
      setShowCreateForm(false);
      
      // Refresh evaluators list
      fetchEvaluators();
      
      alert('Evaluator account created successfully! Invitation sent.');
    } catch (error) {
      console.error('Error creating evaluator:', error);
      alert('Error creating evaluator account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const sendEvaluatorInvitation = async (evaluatorData) => {
    // This would send email with evaluator credentials
    const emailData = {
      to: evaluatorData.email,
      subject: 'Innoverse 2025 - Evaluator Portal Invitation',
      template: 'evaluator-invitation',
      data: {
        name: evaluatorData.name,
        email: evaluatorData.email,
        password: evaluatorData.password,
        loginUrl: 'https://innoverse-n.vercel.app/login',
        organization: evaluatorData.evaluatorDetails.organization,
        expertise: evaluatorData.evaluatorDetails.expertise
      }
    };
    
    console.log('Sending evaluator invitation:', emailData);
    // await emailAPI.send(emailData);
  };

  const resendInvitation = async (evaluator) => {
    try {
      await sendEvaluatorInvitation({
        email: evaluator.email,
        name: evaluator.name,
        password: 'resetPassword123', // This would be generated or retrieved
        evaluatorDetails: { 
          organization: evaluator.organization,
          expertise: evaluator.expertise
        }
      });
      alert('Invitation resent successfully!');
    } catch (error) {
      console.error('Error resending invitation:', error);
      alert('Error resending invitation.');
    }
  };

  const assignTeams = (evaluatorId) => {
    // This would open a modal to assign teams to evaluator
    alert(`Assign teams to evaluator ${evaluatorId}`);
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
                  Evaluator Management
                </h1>
                <p className="text-gray-400 text-lg">
                  Create and manage evaluator accounts for Innoverse 2025
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                >
                  {showCreateForm ? '❌ Cancel' : '➕ Add Evaluator'}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Create Evaluator Form */}
          {showCreateForm && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-gray-800 border-gray-700">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <span className="text-2xl mr-3">👨‍⚖️</span>
                    Add New Evaluator
                  </h3>
                </div>
                <div className="p-6">
                  <form onSubmit={handleCreateEvaluator} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Evaluator Name *
                        </label>
                        <Input
                          value={newEvaluator.name}
                          onChange={(e) => setNewEvaluator({...newEvaluator, name: e.target.value})}
                          placeholder="Dr. Jane Doe"
                          required
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address * (Invitation will be sent here)
                        </label>
                        <Input
                          type="email"
                          value={newEvaluator.email}
                          onChange={(e) => setNewEvaluator({...newEvaluator, email: e.target.value})}
                          placeholder="jane.doe@company.com"
                          required
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Organization / Company
                        </label>
                        <Input
                          value={newEvaluator.organization}
                          onChange={(e) => setNewEvaluator({...newEvaluator, organization: e.target.value})}
                          placeholder="TechCorp, University, etc."
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Experience Level
                        </label>
                        <Input
                          value={newEvaluator.experience}
                          onChange={(e) => setNewEvaluator({...newEvaluator, experience: e.target.value})}
                          placeholder="5+ years, 10+ years, etc."
                          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expertise & Areas of Interest
                      </label>
                      <Textarea
                        value={newEvaluator.expertise}
                        onChange={(e) => setNewEvaluator({...newEvaluator, expertise: e.target.value})}
                        placeholder="AI/ML, Fintech, Healthcare Tech, Business Strategy, etc."
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Evaluator Type
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="internal"
                            checked={newEvaluator.role === 'internal'}
                            onChange={(e) => setNewEvaluator({...newEvaluator, role: e.target.value})}
                            className="mr-2"
                          />
                          <span className="text-white">Internal (University/Institution)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="external"
                            checked={newEvaluator.role === 'external'}
                            onChange={(e) => setNewEvaluator({...newEvaluator, role: e.target.value})}
                            className="mr-2"
                          />
                          <span className="text-white">External (Industry Expert)</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={loading}
                          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                        >
                          {loading ? '⏳ Creating...' : '✅ Create Account & Send Invitation'}
                        </Button>
                      </motion.div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateForm(false)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Evaluators List */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gray-800 border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <span className="text-2xl mr-3">👨‍⚖️</span>
                  Evaluators ({evaluators.length})
                </h3>
              </div>
              <div className="p-6">
                {evaluators.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👨‍⚖️</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No evaluators added yet</h3>
                    <p className="text-gray-400">
                      Add evaluators to assess team presentations
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluators.map((evaluator) => (
                      <motion.div
                        key={evaluator.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-white mb-1">{evaluator.name}</h4>
                            <p className="text-blue-400">{evaluator.organization}</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 text-xs">
                              {evaluator.status}
                            </Badge>
                            <Badge className={`text-xs ${
                              evaluator.role === 'external' 
                                ? 'bg-orange-600/20 text-orange-400 border-orange-500/30' 
                                : 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                            }`}>
                              {evaluator.role}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div>
                            <span className="text-gray-400 text-sm">Email: </span>
                            <span className="text-gray-300 text-sm">{evaluator.email}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Experience: </span>
                            <span className="text-gray-300 text-sm">{evaluator.experience}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Teams Assigned: </span>
                            <span className="text-cyan-400 text-sm font-semibold">{evaluator.teamsAssigned}</span>
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Evaluations Done: </span>
                            <span className="text-emerald-400 text-sm font-semibold">{evaluator.evaluationsCompleted}</span>
                          </div>
                        </div>

                        {evaluator.expertise && (
                          <div className="mb-4">
                            <span className="text-gray-400 text-sm">Expertise: </span>
                            <p className="text-gray-300 text-sm mt-1">{evaluator.expertise}</p>
                          </div>
                        )}

                        <div className="flex gap-2 mb-3">
                          <Button
                            size="sm"
                            onClick={() => assignTeams(evaluator.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                          >
                            🎯 Assign Teams
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => resendInvitation(evaluator)}
                            className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                          >
                            📧 Resend Invite
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            ✏️ Edit
                          </Button>
                        </div>
                      </motion.div>
                    ))}
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

export default AdminEvaluators;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { adminAPI } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const { addToast: toast } = useToast();
  
  const [newTeam, setNewTeam] = useState({
    teamName: '',
    teamSize: '',
    leaderName: '',
    leaderEmail: '',
    password: '',
    members: [],
    projectIdea: ''
  });
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getTeams();
      setTeams(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching teams:', error);
      console.error('❌ Error response data:', error.response?.data, 'status:', error.response?.status);
      toast({
        title: 'Error',
        description: 'Failed to fetch teams',
        variant: 'destructive',
      });
      // clear list to avoid stale UI
      setTeams([]);
      // If unauthorized or forbidden, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setNewTeam(prev => ({
      ...prev,
      teamSize: size,
      members: Array(Math.max(0, size - 1)).fill('') // Create array with (size - 1) empty strings for member names (excluding leader)
    }));
  };

  const handleMemberChange = (index, value) => {
    setNewTeam(prev => ({
      ...prev,
      members: prev.members.map((member, i) => 
        i === index ? value : member
      )
    }));
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newTeam.teamName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Team name is required',
        type: 'destructive',
      });
      return;
    }
    
    if (!newTeam.leaderName.trim() || !newTeam.leaderEmail.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Team leader name and email are required',
        type: 'destructive',
      });
      return;
    }

    if (!newTeam.teamSize) {
      toast({
        title: 'Validation Error',
        description: 'Please select team size',
        type: 'destructive',
      });
      return;
    }

    // Check if all team member names are filled
    const emptyMembers = newTeam.members.filter(member => !member.trim());
    if (emptyMembers.length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all team member names',
        type: 'destructive',
      });
      return;
    }

    try {
      setCreateLoading(true);
      
      const teamData = {
        teamName: newTeam.teamName.trim(),
        teamLeader: {
          name: newTeam.leaderName.trim(),
          email: newTeam.leaderEmail.trim().toLowerCase(),
        },
        teamSize: parseInt(newTeam.teamSize),
        teamMembers: newTeam.members.filter(member => member.trim()),
        projectDetails: {
          idea: newTeam.projectIdea.trim()
        },
        customPassword: newTeam.password.trim() || undefined
      };

      console.log('📝 Sending team data:', teamData);
      const response = await adminAPI.createTeam(teamData);
      
      toast({
        title: 'Success',
        description: `Team "${teamData.teamName}" created successfully! Invitation sent to ${teamData.teamLeader.email}`,
        type: 'success',
      });

      // Reset form
      setNewTeam({
        teamName: '',
        teamSize: '',
        leaderName: '',
        leaderEmail: '',
        password: '',
        members: [],
        projectIdea: ''
      });
      
      setShowCreateForm(false);
      fetchTeams(); // Refresh the teams list
      
      console.log('✅ Team created:', response.data);
    } catch (error) {
      console.error('❌ Error creating team:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.response?.data?.message);
      
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create team',
        type: 'destructive',
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleResendInvitation = async (teamId, teamName) => {
    try {
      await adminAPI.resendTeamInvitation(teamId);
      toast({
        title: 'Success',
        description: `Invitation resent for team "${teamName}"`,
        type: 'success',
      });
    } catch (error) {
      console.error('❌ Error resending invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to resend invitation',
        type: 'destructive',
      });
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Delete this team and its user account?')) return;
    try {
      await adminAPI.deleteTeam(teamId);
      toast({ title: 'Deleted', description: 'Team removed', type: 'success' });
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({ title: 'Error', description: 'Failed to delete team', type: 'destructive' });
    }
  };

  const handleEditTeam = (team) => {
    setEditingTeam({
      _id: team._id,
      teamName: team.teamName,
      leaderEmail: team.teamLeader?.email || ''
    });
  };

  const submitEditTeam = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateTeam(editingTeam._id, { teamName: editingTeam.teamName, teamLeader: { email: editingTeam.leaderEmail } });
      setEditingTeam(null);
      fetchTeams();
      toast({ title: 'Updated', description: 'Team updated', type: 'success' });
    } catch (error) {
      console.error('Error updating team:', error);
      toast({ title: 'Error', description: 'Failed to update team', type: 'destructive' });
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Team Management
            </h1>
            <p className="text-gray-400 text-lg">
              Create and manage team accounts for Innoverse 2025
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              {showCreateForm ? '❌ Cancel' : '➕ Create New Team'}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Create Team Form */}
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
                <span className="text-2xl mr-3">➕</span>
                Create New Team Account
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateTeam} className="space-y-6">
                {/* Basic Team Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Name *
                    </label>
                    <Input
                      value={newTeam.teamName}
                      onChange={(e) => setNewTeam({...newTeam, teamName: e.target.value})}
                      placeholder="Enter team name"
                      required
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Team Size * (including leader)
                    </label>
                    <select
                      value={newTeam.teamSize}
                      onChange={handleTeamSizeChange}
                      required
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select team size</option>
                      {[3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                        <option key={size} value={size}>{size} members</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Team Leader Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                    👑 Team Leader Information
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Leader Name *
                      </label>
                      <Input
                        value={newTeam.leaderName}
                        onChange={(e) => setNewTeam({...newTeam, leaderName: e.target.value})}
                        placeholder="Enter leader name"
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Leader Email * (Credentials will be sent here)
                      </label>
                      <Input
                        type="email"
                        value={newTeam.leaderEmail}
                        onChange={(e) => setNewTeam({...newTeam, leaderEmail: e.target.value})}
                        placeholder="Enter leader email"
                        required
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {newTeam.teamSize && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white border-b border-gray-600 pb-2">
                      👥 Team Members ({newTeam.teamSize} total)
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {newTeam.members.map((member, index) => (
                        <div key={index}>
        {/* Edit Team Modal */}
        {editingTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setEditingTeam(null)} />
            <Card className="z-10 w-full max-w-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Edit Team</h3>
                <form onSubmit={submitEditTeam} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Team Name</label>
                    <input value={editingTeam.teamName} onChange={(e) => setEditingTeam({...editingTeam, teamName: e.target.value})} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Leader Email</label>
                    <input value={editingTeam.leaderEmail} onChange={(e) => setEditingTeam({...editingTeam, leaderEmail: e.target.value})} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditingTeam(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {index === 0 ? '👑 Team Leader Name' : `Member ${index + 1} Name`}
                            {index === 0 && ' *'}
                          </label>
                          <Input
                            value={member}
                            onChange={(e) => handleMemberChange(index, e.target.value)}
                            placeholder={index === 0 ? 'Team leader name' : `Member ${index + 1} name`}
                            required={index === 0}
                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Team Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Team Password (Optional - Auto-generated if left empty)
                  </label>
                  <Input
                    type="password"
                    value={newTeam.password}
                    onChange={(e) => setNewTeam({...newTeam, password: e.target.value})}
                    placeholder="Leave empty for auto-generated password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    If left empty, a secure password will be generated automatically
                  </p>
                </div>

                {/* Project Idea */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Idea (Optional)
                  </label>
                  <Textarea
                    value={newTeam.projectIdea}
                    onChange={(e) => setNewTeam({...newTeam, projectIdea: e.target.value})}
                    placeholder="Brief description of the project idea"
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4 border-t border-gray-600">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={createLoading || !newTeam.teamSize}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createLoading ? '⏳ Creating Team...' : '✅ Create Team & Send Credentials'}
                    </Button>
                  </motion.div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewTeam({
                        teamName: '',
                        teamSize: '',
                        leaderName: '',
                        leaderEmail: '',
                        password: '',
                        members: [],
                        projectIdea: ''
                      });
                    }}
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

      {/* Teams List */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <span className="text-2xl mr-3">👥</span>
              Registered Teams ({teams.length})
            </h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-semibold text-white mb-2">Loading teams...</h3>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-white mb-2">No teams registered yet</h3>
                <p className="text-gray-400">
                  Create the first team account to get started
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <motion.div
                    key={team._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-2xl border border-blue-500/20 backdrop-blur-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0">
                        <h4 className="text-lg font-bold text-white mb-1 truncate">{team.teamName}</h4>
                        <p className="text-blue-400 truncate">Led by {team.teamLeader?.name || 'Unknown'}</p>
                      </div>
                      <Badge className="bg-emerald-600/20 text-emerald-400 border-emerald-500/30 text-xs ml-2 flex-shrink-0">
                        {team.status || 'Active'}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="text-gray-400 text-sm">Email:</span>
                        <span className="text-gray-300 text-sm break-all sm:ml-2 max-w-xs">{team.teamLeader?.email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Members: </span>
                        <span className="text-gray-300 text-sm">{team.teamMembers?.length || 0}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm">Created: </span>
                        <span className="text-gray-300 text-sm">{new Date(team.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {team.projectIdea && (
                      <div className="mb-4">
                        <span className="text-gray-400 text-sm">Idea: </span>
                        <p className="text-gray-300 text-sm mt-1">{team.projectIdea}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleResendInvitation(team._id, team.teamName)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        📧 Resend Credentials
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditTeam(team)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        ✏️ Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTeam(team._id)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        🗑️ Delete
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
  );
}

export default AdminTeams;

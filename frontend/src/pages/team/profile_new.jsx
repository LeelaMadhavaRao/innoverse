import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../context/auth-context';
import { teamAPI } from '../../lib/api';
import Navigation from '../../components/navigation';

function TeamProfile() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Stats state
  const [stats, setStats] = useState({
    projectsSubmitted: 0,
    evaluationsCompleted: 0,
    galleryItems: 0,
    currentRank: '--',
    totalScore: 0,
    averageScore: 0,
    ranksDisclosed: false
  });

  // Problem statement state
  const [problemStatement, setProblemStatement] = useState('');
  const [isEditingProblem, setIsEditingProblem] = useState(false);

  // Add member state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Team profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    teamName: '',
    teamLeader: null,
    teamMembers: []
  });
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [newLeaderEmail, setNewLeaderEmail] = useState('');

  // Team leader disclaimer state
  const [showTeamLeaderDisclaimer, setShowTeamLeaderDisclaimer] = useState(false);
  const [pendingTeamLeaderChange, setPendingTeamLeaderChange] = useState(null);

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
        staggerChildren: 0.2
      }
    }
  };

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5, transition: { duration: 0.3 } }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      loadStats();
      loadProblemStatement();
      setEditedProfile({
        teamName: profile.teamName || '',
        teamLeader: profile.teamLeader || null,
        teamMembers: profile.teamMembers || []
      });
    }
  }, [profile]);

  const loadProfile = async () => {
    try {
      const response = await teamAPI.getProfile();
      console.log('Profile response:', response.data);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Profile load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get actual gallery count from backend
      const galleryResponse = await teamAPI.getGallery();
      const galleryData = galleryResponse.data;
      const actualGalleryCount = galleryData.totalCount || 0;
      
      // Calculate stats from profile data
      const totalEvaluations = profile?.evaluationScores?.length || 0;
      const averageScore = totalEvaluations > 0 
        ? profile.evaluationScores.reduce((sum, evaluation) => sum + evaluation.totalScore, 0) / totalEvaluations 
        : 0;
      
      setStats({
        projectsSubmitted: profile?.projectDetails?.title ? 1 : 0,
        evaluationsCompleted: Math.round(averageScore),
        galleryItems: actualGalleryCount,
        currentRank: profile?.stats?.ranksDisclosed ? `#${profile.stats.rank}` : 'Not Disclosed',
        totalScore: profile?.finalScore || Math.round(averageScore),
        averageScore: Math.round(averageScore),
        ranksDisclosed: profile?.stats?.ranksDisclosed || false
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadProblemStatement = async () => {
    try {
      if (profile?.projectDetails?.description) {
        setProblemStatement(profile.projectDetails.description);
      } else {
        setProblemStatement('');
      }
    } catch (err) {
      setProblemStatement('');
    }
  };

  const handleSaveProblemStatement = async () => {
    try {
      setIsEditingProblem(false);
      await teamAPI.updateProfile({ problemStatement });
      
      // Update local profile
      setProfile(prev => ({
        ...prev,
        projectDetails: {
          ...prev.projectDetails,
          description: problemStatement
        }
      }));
    } catch (err) {
      setError('Failed to save problem statement');
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return;

    try {
      const newMember = {
        name: newMemberName.trim(),
        email: newMemberEmail.trim(),
        role: 'member'
      };

      const response = await teamAPI.updateProfile({ 
        teamMembers: [...(profile?.teamMembers || []), newMember] 
      });

      setProfile(prev => ({
        ...prev,
        teamMembers: [...(prev?.teamMembers || []), newMember]
      }));

      setNewMemberName('');
      setNewMemberEmail('');
      setIsAddingMember(false);
    } catch (err) {
      setError('Failed to add member');
    }
  };

  const checkForTeamLeaderChange = () => {
    if (!editedProfile.teamLeader || !profile.teamLeader) return false;
    
    const currentLeaderName = profile.teamLeader.name;
    const newLeaderName = typeof editedProfile.teamLeader === 'string' 
      ? editedProfile.teamLeader 
      : editedProfile.teamLeader.name;
    
    return newLeaderName !== currentLeaderName;
  };

  const handleSaveProfile = async () => {
    try {
      // Check if team leader is being changed
      if (checkForTeamLeaderChange()) {
        // Show disclaimer dialog
        setShowTeamLeaderDisclaimer(true);
        return;
      }

      // If no team leader change, proceed normally
      await performSaveProfile();
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile: ' + (err.response?.data?.message || err.message));
    }
  };

  const performSaveProfile = async () => {
    try {
      // Find the selected team leader from team members or current leader
      let selectedLeader = null;
      
      // If teamLeader is a string (name), find the corresponding member object
      if (typeof editedProfile.teamLeader === 'string') {
        // Check if it's the current leader
        if (profile.teamLeader && editedProfile.teamLeader === profile.teamLeader.name) {
          selectedLeader = profile.teamLeader;
        } else {
          // Find from team members
          selectedLeader = editedProfile.teamMembers.find(member => member.name === editedProfile.teamLeader);
        }
      } else {
        selectedLeader = editedProfile.teamLeader;
      }

      // If no email exists for the selected leader, use the new email input
      if (selectedLeader && (!selectedLeader.email || selectedLeader.email.trim() === '')) {
        if (!newLeaderEmail || !newLeaderEmail.trim()) {
          setError('Email is required for the team leader');
          return;
        }
        selectedLeader = {
          ...selectedLeader,
          email: newLeaderEmail.trim()
        };
      }

      // Validate that the selected leader has an email
      if (!selectedLeader || !selectedLeader.email) {
        setError('Selected team leader must have an email address');
        return;
      }

      // Prepare the update data with proper structure
      const updateData = {
        teamName: editedProfile.teamName,
        teamLeader: selectedLeader, // Send the complete leader object
        teamMembers: editedProfile.teamMembers
      };

      const response = await teamAPI.updateProfile(updateData);
      
      // Update local state with the response
      if (response.data.team) {
        setProfile(prev => ({
          ...prev,
          ...response.data.team,
          teamName: response.data.team.teamName,
          teamLeader: response.data.team.teamLeader,
          teamMembers: response.data.team.teamMembers
        }));
      }
      
      setIsEditingProfile(false);
      setShowEmailInput(false);
      setNewLeaderEmail('');
      
      // Check if team leader was changed - if so, logout the user
      if (response.data.changes && response.data.changes.teamLeaderChanged) {
        // Show success message first
        addToast({ title: 'Success', description: 'Team leader changed successfully! You will be logged out. New credentials have been sent to the new team leader\'s email.', type: 'success' });
        
        // Logout the user after a short delay
        setTimeout(() => {
          logout();
        }, 2000);
      }
      
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleTeamLeaderDisclaimerConfirm = async () => {
    setShowTeamLeaderDisclaimer(false);
    setPendingTeamLeaderChange(null);
    await performSaveProfile();
  };

  const handleTeamLeaderDisclaimerCancel = () => {
    setShowTeamLeaderDisclaimer(false);
    setPendingTeamLeaderChange(null);
    // Reset to original state
    setEditedProfile({
      teamName: profile.teamName || '',
      teamLeader: profile.teamLeader || null,
      teamMembers: profile.teamMembers || []
    });
    setShowEmailInput(false);
    setNewLeaderEmail('');
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setShowEmailInput(false);
    setNewLeaderEmail('');
    setEditedProfile({
      teamName: profile.teamName || '',
      teamLeader: profile.teamLeader || null,
      teamMembers: profile.teamMembers || []
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-400 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome, {profile?.teamName || 'Team'}! 👋
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your team profile, track your progress, and stay updated with your project details.
            </p>
          </motion.div>

          {/* Main Content Grid - Team Info and Problem Statement Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Left Column - Team Profile Card */}
            <motion.div variants={fadeInUp}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="group h-full"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 transition-all duration-300 group-hover:bg-white/10 h-full">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="text-3xl">👥</span>
                      Team Profile
                    </h2>
                    {!isEditingProfile ? (
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Team Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                      {isEditingProfile ? (
                        <Input
                          value={editedProfile.teamName}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, teamName: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Enter team name"
                        />
                      ) : (
                        <p className="text-white text-xl font-semibold">{profile.teamName}</p>
                      )}
                    </div>

                    {/* Team Leader */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Team Leader</label>
                      {isEditingProfile ? (
                        <div>
                          <select
                            value={typeof editedProfile.teamLeader === 'string' ? editedProfile.teamLeader : editedProfile.teamLeader?.name || ''}
                            onChange={(e) => {
                              const selectedName = e.target.value;
                              let selectedMember = null;
                              
                              // Find the selected member from current leader or team members
                              if (profile.teamLeader && selectedName === profile.teamLeader.name) {
                                selectedMember = profile.teamLeader;
                              } else {
                                selectedMember = profile.teamMembers?.find(member => member.name === selectedName);
                              }
                              
                              // Check if email input is needed
                              const needsEmail = selectedMember && (!selectedMember.email || selectedMember.email.trim() === '');
                              setShowEmailInput(needsEmail);
                              if (needsEmail) {
                                setNewLeaderEmail('');
                              }
                              
                              setEditedProfile(prev => ({
                                ...prev,
                                teamLeader: selectedMember || selectedName
                              }));
                            }}
                            className="w-full p-3 bg-white/10 border border-white/20 text-white rounded-lg focus:border-purple-500 outline-none"
                          >
                            <option value="" className="bg-gray-800 text-white">Select team leader</option>
                            {/* Current team leader */}
                            {profile.teamLeader && (
                              <option value={profile.teamLeader.name} className="bg-gray-800 text-white">
                                {profile.teamLeader.name} (Current Leader) {profile.teamLeader.email && `- ${profile.teamLeader.email}`}
                              </option>
                            )}
                            {/* All team members */}
                            {profile.teamMembers?.map((member, index) => (
                              <option key={index} value={member.name} className="bg-gray-800 text-white">
                                {member.name} {member.email ? `(${member.email})` : '(No email - will be requested)'}
                              </option>
                            ))}
                          </select>
                          
                          {/* Email input when needed */}
                          {showEmailInput && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email address for new team leader
                              </label>
                              <Input
                                type="email"
                                value={newLeaderEmail}
                                onChange={(e) => setNewLeaderEmail(e.target.value)}
                                className="bg-white/10 border-white/20 text-white"
                                placeholder="Enter email address"
                                required
                              />
                              <p className="text-xs text-gray-400 mt-1">
                                Team leader must have an email address
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {(profile?.teamLeader?.name)?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white text-lg">{profile?.teamLeader?.name}</div>
                            <div className="text-sm text-gray-400">{profile?.teamLeader?.email}</div>
                            {profile?.teamLeader?.phone && (
                              <div className="text-sm text-gray-500">{profile.teamLeader.phone}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                      <p className="text-gray-400">{profile?.teamLeader?.email || profile?.email || user?.email}</p>
                    </div>

                    {/* Team Members */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-300">Team Members</label>
                        <Button
                          onClick={() => setIsAddingMember(true)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Add Member
                        </Button>
                      </div>

                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {profile?.teamMembers && profile.teamMembers.length > 0 ? (
                          profile.teamMembers.map((member, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">{member.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white truncate">{member.name}</div>
                                {member.email && <div className="text-xs text-gray-400 truncate">{member.email}</div>}
                                <div className="text-xs text-gray-500">{member.role || 'Member'}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-400 text-center py-8">No team members added yet</p>
                        )}
                      </div>

                      {/* Add Member Form */}
                      {isAddingMember && (
                        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                          <h4 className="text-white font-medium mb-3">Add New Member</h4>
                          <div className="space-y-3">
                            <Input
                              placeholder="Member name"
                              value={newMemberName}
                              onChange={(e) => setNewMemberName(e.target.value)}
                              className="bg-white/10 border-white/20 text-white"
                            />
                            <Input
                              placeholder="Member email (optional)"
                              type="email"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              className="bg-white/10 border-white/20 text-white"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={handleAddMember}
                                disabled={!newMemberName.trim()}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Add
                              </Button>
                              <Button
                                onClick={() => {
                                  setIsAddingMember(false);
                                  setNewMemberName('');
                                  setNewMemberEmail('');
                                }}
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Right Column - Problem Statement */}
            <motion.div variants={fadeInUp}>
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="group h-full"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-8 transition-all duration-300 group-hover:bg-white/10 h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      Problem Statement
                    </h3>
                    {!isEditingProblem ? (
                      <Button
                        onClick={() => setIsEditingProblem(true)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProblemStatement}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setIsEditingProblem(false)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditingProblem ? (
                      <Textarea
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        placeholder="Describe your team's problem statement and project goals..."
                        className="min-h-[300px] bg-white/10 border-white/20 text-white resize-none"
                      />
                    ) : (
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10 min-h-[300px]">
                        {problemStatement ? (
                          <p className="text-gray-300 leading-relaxed">
                            {problemStatement}
                          </p>
                        ) : (
                          <p className="text-gray-500 italic">No problem statement added yet. Click Edit to add one.</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div variants={fadeInUp} className="mb-12">
            <motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="group"
            >
              <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-500/20 backdrop-blur-sm p-6 transition-all duration-300 group-hover:from-purple-600/30 group-hover:to-pink-600/30">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Team Statistics
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-300">{stats.projectsSubmitted}</div>
                    <div className="text-sm text-gray-300">Projects Submitted</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">{stats.galleryItems}</div>
                    <div className="text-sm text-gray-300">Gallery Items</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">{stats.averageScore}%</div>
                    <div className="text-sm text-gray-300">Average Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-300">{stats.currentRank}</div>
                    <div className="text-sm text-gray-300">Current Rank</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-300">{(profile?.teamMembers?.length || 0) + 1}</div>
                    <div className="text-sm text-gray-300">Team Size</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <motion.div
              variants={cardHover}
              initial="rest"
              whileHover="hover"
              className="group"
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm p-6 transition-all duration-300 group-hover:bg-white/10">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link to="/gallery">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 justify-start h-16">
                      <div className="flex flex-col items-start">
                        <span className="text-lg">📸 Gallery</span>
                        <span className="text-xs opacity-80">Upload & view photos (admin approval required)</span>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link to="/team/results">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 justify-start h-16">
                      <div className="flex flex-col items-start">
                        <span className="text-lg">📈 Results</span>
                        <span className="text-xs opacity-80">View evaluation scores & rankings</span>
                      </div>
                    </Button>
                  </Link>
                  
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 justify-start h-16">
                    <div className="flex flex-col items-start">
                      <span className="text-lg">💬 Support</span>
                      <span className="text-xs opacity-80">Get help & contact organizers</span>
                    </div>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Team Leader Change Disclaimer Dialog */}
      {showTeamLeaderDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={handleTeamLeaderDisclaimerCancel}
          ></div>
          
          {/* Dialog Content */}
          <div className="relative bg-gray-800 border border-gray-600 rounded-lg shadow-2xl max-w-md w-full mx-auto p-6 z-10">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2 mb-4">
                ⚠️ Important Notice
              </h3>
              <div className="text-gray-300 space-y-3">
                <p className="font-semibold">If you change the team leader:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>You will be logged out immediately</li>
                  <li>New login credentials will be generated</li>
                  <li>The new credentials will be sent to the new team leader's email</li>
                  <li>Only the new team leader will be able to access the team dashboard</li>
                </ul>
                <p className="font-semibold text-yellow-300 mt-4">
                  Are you sure you want to proceed?
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleTeamLeaderDisclaimerCancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleTeamLeaderDisclaimerConfirm}
                className="bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Yes, Change Team Leader
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamProfile;

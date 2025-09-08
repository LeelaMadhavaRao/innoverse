import { useState, useEffect } from 'react';
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
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    projectsSubmitted: 0,
    evaluationsCompleted: 0,
    galleryItems: 0,
    currentRank: '--',
    totalScore: 0,
    averageScore: 0,
    ranksDisclosed: false
  });
  const [problemStatement, setProblemStatement] = useState('');
  const [isEditingProblem, setIsEditingProblem] = useState(false);
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
      console.error('Stats load error:', err);
      // Set realistic stats with actual data
      setStats({
        projectsSubmitted: profile?.projectDetails?.title ? 1 : 0,
        evaluationsCompleted: 0,
        galleryItems: 0,
        currentRank: 'Not Disclosed',
        totalScore: 0,
        averageScore: 0,
        ranksDisclosed: false
      });
    }
  };

  const loadProblemStatement = async () => {
    try {
      // Load problem statement from profile project details
      if (profile?.projectDetails?.description) {
        setProblemStatement(profile.projectDetails.description);
      } else {
        setProblemStatement('');
      }
    } catch (err) {
      console.error('Problem statement load error:', err);
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
      
      // API call to add team member
      await teamAPI.updateProfile({ 
        teamMembers: [...(profile?.teamMembers || []), newMember] 
      });
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        teamMembers: [...(prev?.teamMembers || []), newMember]
      }));
      
      setNewMemberName('');
      setNewMemberEmail('');
      setIsAddingMember(false);
    } catch (err) {
      console.error('Failed to add team member:', err);
    }
  };

  const handleRemoveMember = async (memberIndex) => {
    try {
      const updatedMembers = profile.teamMembers.filter((_, index) => index !== memberIndex);
      
      // API call to update team members
      await teamAPI.updateProfile({ teamMembers: updatedMembers });
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        teamMembers: updatedMembers
      }));
    } catch (err) {
      console.error('Failed to remove team member:', err);
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
        alert('Team leader changed successfully! You will be logged out. New credentials have been sent to the new team leader\'s email.');
        
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl"
          >
            <div className="text-4xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Profile</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button onClick={loadProfile} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      
      {/* Hero Section with Profile Header */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Animated Background */}
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
                Team Dashboard
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                Welcome Back,
              </span>
              <br />
              <span className="text-white">{profile?.teamName || profile?.name || user?.name}</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed text-gray-300"
            >
              Track your innovation journey, manage submissions, and monitor your team's progress in the competition.
            </motion.p>

            {/* Quick Action Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/team/gallery">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-2xl"
                  >
                    📸 Manage Gallery
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/team/results">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-teal-500/50 text-teal-400 hover:bg-teal-600/10 px-8 py-4 text-lg backdrop-blur-sm"
                  >
                    📈 View Results
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/gallery">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-600/10 px-8 py-4 text-lg backdrop-blur-sm"
                  >
                    🖼️ Public Gallery
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
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
              📊 Your Performance
            </motion.h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { label: 'Projects Submitted', value: stats.projectsSubmitted, icon: '🚀', color: 'purple' },
                { label: 'Evaluation Score', value: stats.averageScore > 0 ? `${stats.averageScore}%` : 'Pending', icon: '⭐', color: 'blue' },
                { label: 'Gallery Items', value: stats.galleryItems, icon: '📸', color: 'teal' },
                { 
                  label: 'Current Rank', 
                  value: stats.ranksDisclosed ? stats.currentRank : 'Not Disclosed', 
                  icon: stats.ranksDisclosed ? '🏆' : '🔒', 
                  color: stats.ranksDisclosed ? 'yellow' : 'gray' 
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  whileHover={cardHover.hover}
                  initial={cardHover.rest}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6 text-center group"
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className={`text-3xl font-bold mb-2 ${
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'teal' ? 'text-teal-400' : 
                    stat.color === 'yellow' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Profile Card */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-700/50 p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mr-4">
                      {(profile?.teamName || profile?.name || user?.name)?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{profile?.teamName || profile?.name || user?.name}</h3>
                      <p className="text-gray-400">{profile?.teamLeader?.email || profile?.email || user?.email}</p>
                      <p className="text-gray-500 text-sm">{profile?.institution || 'Institution not specified'}</p>
                    </div>
                  </div>
                  
                  {/* Edit Profile Button */}
                  {!isEditingProfile ? (
                    <Button
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
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

                <div className="space-y-4">
                  {/* Team Name */}
                  {isEditingProfile && (
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                      <h4 className="text-green-400 font-semibold mb-3 flex items-center">
                        ✏️ Edit Team Name
                      </h4>
                      <Input
                        value={editedProfile.teamName}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, teamName: e.target.value }))}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="Enter team name"
                      />
                    </div>
                  )}

                  {/* Team Leader */}
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h4 className="text-purple-400 font-semibold mb-3 flex items-center">
                      👑 Team Leader
                    </h4>
                    
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
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:border-purple-500 outline-none"
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
                              className="bg-gray-700/50 border-gray-600 text-white"
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
                      <div className="flex items-center text-gray-300">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3">
                          {(profile?.teamLeader?.name)?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold">{profile?.teamLeader?.name}</div>
                          <div className="text-sm text-gray-400">{profile?.teamLeader?.email}</div>
                          {profile?.teamLeader?.phone && (
                            <div className="text-sm text-gray-500">{profile.teamLeader.phone}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Team Members */}
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-blue-400 font-semibold flex items-center">
                        👥 Team Members ({(profile?.teamMembers?.length || 0)})
                      </h4>
                      <Button
                        size="sm"
                        onClick={() => setIsAddingMember(true)}
                        className="bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 text-xs"
                      >
                        + Add Member
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {profile?.teamMembers?.map((member, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white mr-3">
                              {member.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium">{member.name}</div>
                              {member.email && <div className="text-sm text-gray-400">{member.email}</div>}
                              {member.role && <div className="text-xs text-gray-500 capitalize">{member.role}</div>}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveMember(index)}
                            className="border-red-500/30 text-red-400 hover:bg-red-600/10 text-xs"
                          >
                            Remove
                          </Button>
                        </motion.div>
                      )) || (
                        <p className="text-gray-500 italic text-center py-4">No team members added yet. Click "Add Member" to get started.</p>
                      )}
                    </div>

                    {/* Add Member Form */}
                    <AnimatePresence>
                      {isAddingMember && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-blue-500/20"
                        >
                          <h5 className="text-white font-semibold mb-3">Add New Team Member</h5>
                          <div className="space-y-3">
                            <Input
                              placeholder="Member Name *"
                              value={newMemberName}
                              onChange={(e) => setNewMemberName(e.target.value)}
                              className="bg-gray-800/50 border-gray-600 text-white"
                            />
                            <Input
                              placeholder="Member Email (optional)"
                              type="email"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              className="bg-gray-800/50 border-gray-600 text-white"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={handleAddMember}
                                disabled={!newMemberName.trim()}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                              >
                                Add Member
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsAddingMember(false);
                                  setNewMemberName('');
                                  setNewMemberEmail('');
                                }}
                                className="border-gray-600 text-gray-400 hover:bg-gray-700"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Project Details */}
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h4 className="text-teal-400 font-semibold mb-3 flex items-center">
                      🚀 Project Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Project Title</div>
                        <div className="text-white font-medium">{profile?.projectDetails?.title || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Category</div>
                        <Badge className="bg-teal-600/20 text-teal-400 border-teal-500/30">
                          {profile?.projectDetails?.category || 'General'}
                        </Badge>
                      </div>
                      {profile?.projectDetails?.techStack?.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Tech Stack</div>
                          <div className="flex flex-wrap gap-1">
                            {profile.projectDetails.techStack.map((tech, index) => (
                              <Badge key={index} className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Registration Info */}
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <h4 className="text-yellow-400 font-semibold mb-2 flex items-center">
                      📅 Registration Info
                    </h4>
                    <div className="text-gray-300 space-y-1">
                      <div>Registered: {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</div>
                      <div>Status: <Badge className="bg-green-600/20 text-green-400 border-green-500/30 ml-1">Active</Badge></div>
                      <div>Team Size: {((profile?.teamMembers?.length || 0) + 1)} members</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => {/* TODO: Implement profile edit */}}
                  >
                    ✏️ Edit Profile
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-700/50 p-8 h-full">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  🚀 Quick Actions
                </h3>

                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/team/gallery">
                      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4 hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">📸</div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Manage Gallery</h4>
                            <p className="text-gray-400 text-sm">Upload and organize your project photos</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/team/results">
                      <div className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 rounded-xl p-4 hover:from-teal-600/30 hover:to-blue-600/30 transition-all duration-300">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">📈</div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">View Results</h4>
                            <p className="text-gray-400 text-sm">Check evaluation scores and rankings</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/gallery">
                      <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4 hover:from-yellow-600/30 hover:to-orange-600/30 transition-all duration-300">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">🖼️</div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Public Gallery</h4>
                            <p className="text-gray-400 text-sm">Explore all team submissions</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/">
                      <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-xl p-4 hover:from-green-600/30 hover:to-teal-600/30 transition-all duration-300">
                        <div className="flex items-center">
                          <div className="text-3xl mr-4">🏠</div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">Event Home</h4>
                            <p className="text-gray-400 text-sm">Return to main event page</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
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
              📝 Problem Statement
            </motion.h2>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border-gray-700/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    🎯 Your Innovation Challenge
                  </h3>
                  <Button
                    onClick={() => setIsEditingProblem(!isEditingProblem)}
                    className="bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30"
                  >
                    {isEditingProblem ? '👁️ Preview' : '✏️ Edit'}
                  </Button>
                </div>

                <AnimatePresence mode="wait">
                  {isEditingProblem ? (
                    <motion.div
                      key="editing"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <Textarea
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        placeholder="Describe your problem statement, solution approach, and expected impact..."
                        className="min-h-48 bg-gray-800/50 border-gray-600 text-white resize-none"
                        rows={8}
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={handleSaveProblemStatement}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          💾 Save Problem Statement
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingProblem(false)}
                          className="border-gray-600 text-gray-400 hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="viewing"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-800/30 p-6 rounded-xl border border-gray-700/30"
                    >
                      {problemStatement ? (
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {problemStatement}
                        </div>
                      ) : (
                        <div className="text-gray-500 italic text-center py-8">
                          <div className="text-4xl mb-4">📋</div>
                          <p>No problem statement defined yet.</p>
                          <p className="text-sm mt-2">Click "Edit" to add your innovation challenge description.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Problem Statement Guidelines */}
                <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                  <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                    💡 Guidelines for Problem Statement
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Clearly define the problem you are addressing</li>
                    <li>• Explain your innovative solution approach</li>
                    <li>• Describe the target audience and market</li>
                    <li>• Outline the expected impact and benefits</li>
                    <li>• Mention the technology stack and implementation plan</li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

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

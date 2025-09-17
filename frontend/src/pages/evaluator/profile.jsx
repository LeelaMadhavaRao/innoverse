import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';
import { evaluationAPI } from '../../lib/api';
import Navigation from '../../components/navigation';

const EvaluatorProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    organization: '',
    designation: '',
    expertise: [],
    experience: '',
    type: '',
    phone: ''
  });
  const [statistics, setStatistics] = useState({
    totalAssigned: 0,
    totalCompleted: 0,
    totalRemaining: 0,
    completionRate: 0
  });

  // Fetch evaluator profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await evaluationAPI.getEvaluatorProfile();
        const { profile, statistics: stats } = response.data;
        
        setProfileData({
          name: profile.name || '',
          email: profile.email || '',
          organization: profile.organization || '',
          designation: profile.designation || '',
          expertise: profile.expertise || [],
          experience: profile.experience || '',
          type: profile.type || 'internal',
          phone: profile.phone || ''
        });
        
        setStatistics(stats);
        
        console.log('✅ Evaluator profile loaded:', profile.name);
      } catch (error) {
        console.error('❌ Failed to load evaluator profile:', error);
        
        // Provide specific error messages based on error type
        if (error.response?.status === 403) {
          addToast({
            title: 'Access Restricted',
            description: 'Backend deployment is in progress. Using local profile data.',
            variant: 'destructive'
          });
        } else {
          addToast({
            title: 'Error',
            description: 'Failed to load profile data. Using fallback data.',
            variant: 'destructive'
          });
        }
        
        // Fallback to user data if available
        if (user) {
          setProfileData({
            name: user.name || '',
            email: user.email || '',
            organization: user.evaluatorProfile?.organization || '',
            designation: user.evaluatorProfile?.designation || '',
            expertise: user.evaluatorProfile?.expertise || [],
            experience: user.evaluatorProfile?.experience || '',
            type: user.evaluatorProfile?.type || 'internal',
            phone: user.phone || ''
          });
        }
      } finally {
        setProfileLoading(false);
      }
    };

    if (user && user.role === 'evaluator') {
      fetchProfile();
    }
  }, [user, addToast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExpertiseChange = (e) => {
    const value = e.target.value;
    const expertiseArray = value.split(',').map(item => item.trim()).filter(item => item);
    setProfileData(prev => ({
      ...prev,
      expertise: expertiseArray
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        name: profileData.name,
        organization: profileData.organization,
        designation: profileData.designation,
        experience: profileData.experience,
        phone: profileData.phone,
        expertise: profileData.expertise
      };

      const response = await evaluationAPI.updateEvaluatorProfile(updateData);
      
      // Update local state with server response
      setProfileData(prev => ({
        ...prev,
        ...response.data.profile
      }));
      
      addToast({
        title: 'Success',
        description: 'Profile updated successfully!',
        variant: 'success'
      });
      setIsEditing(false);
      
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      addToast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center">
            <div className="text-4xl mb-4">⚖️</div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Universal Navigation */}
      <Navigation />
      
      {/* Main Content with home.jsx theme */}
      <div className="relative min-h-screen pt-16">
        {/* Animated Background - Matching home.jsx */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-cyan-900/30"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
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
                👤
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Evaluator Profile
              </h1>
              <p className="text-gray-300">
                Manage your professional information and evaluation preferences
              </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-400">{statistics.totalAssigned}</div>
                <div className="text-sm text-gray-300">Teams Assigned</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-teal-400">{statistics.totalCompleted}</div>
                <div className="text-sm text-gray-300">Evaluations Complete</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-cyan-400">{statistics.totalRemaining}</div>
                <div className="text-sm text-gray-300">Pending Reviews</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg text-center">
                <div className="text-2xl font-bold text-emerald-400">{statistics.completionRate}%</div>
                <div className="text-sm text-gray-300">Completion Rate</div>
              </div>
            </div>

            {/* Profile Card */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <p className="text-gray-300">Update your professional details</p>
                </div>
                <div className="flex space-x-4">
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      ✏️ Edit Profile
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        {loading ? '⏳ Saving...' : '💾 Save Changes'}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <Input
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`bg-gray-700/50 border-gray-600 text-white ${!isEditing ? 'opacity-60' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={profileData.email}
                      disabled={true}
                      className="bg-gray-700/30 border-gray-600 text-gray-400 opacity-60"
                      title="Email cannot be changed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`bg-gray-700/50 border-gray-600 text-white ${!isEditing ? 'opacity-60' : ''}`}
                      placeholder="Contact number"
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Professional Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Organization
                    </label>
                    <Input
                      name="organization"
                      value={profileData.organization}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`bg-gray-700/50 border-gray-600 text-white ${!isEditing ? 'opacity-60' : ''}`}
                      placeholder="Your organization/company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Designation
                    </label>
                    <Input
                      name="designation"
                      value={profileData.designation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`bg-gray-700/50 border-gray-600 text-white ${!isEditing ? 'opacity-60' : ''}`}
                      placeholder="Your position/title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Evaluator Type
                    </label>
                    <Badge className={`${profileData.type === 'internal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      {profileData.type === 'internal' ? 'Internal Evaluator' : 'External Evaluator'}
                    </Badge>
                  </div>
                </div>

                {/* Expertise and Experience */}
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-lg font-semibold text-white">Expertise & Experience</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Areas of Expertise
                    </label>
                    <Input
                      name="expertise"
                      value={Array.isArray(profileData.expertise) ? profileData.expertise.join(', ') : profileData.expertise}
                      onChange={handleExpertiseChange}
                      disabled={!isEditing}
                      className={`bg-gray-700/50 border-gray-600 text-white ${!isEditing ? 'opacity-60' : ''}`}
                      placeholder="e.g., AI, Machine Learning, Web Development (comma separated)"
                    />
                    {Array.isArray(profileData.expertise) && profileData.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profileData.expertise.map((skill, index) => (
                          <Badge key={index} className="bg-teal-500/20 text-teal-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Professional Experience
                    </label>
                    <textarea
                      name="experience"
                      value={profileData.experience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className={`w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white ${!isEditing ? 'opacity-60' : ''}`}
                      placeholder="Brief description of your professional background and experience"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorProfile;
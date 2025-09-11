import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import FacultyLayout from '../../components/faculty/faculty-layout';
import Navigation from '../../components/navigation';
import FacultyInvitation from '../../components/invitation/FacultyInvitation';
import { useAuth } from '../../context/auth-context';

function FacultyProfile() {
  const { user } = useAuth();
  const [showInvitation, setShowInvitation] = useState(false);

  // Debug faculty data
  console.log('🔍 Faculty Profile Debug - User data:', user);
  console.log('📊 Faculty designation:', user?.designation);
  console.log('🏢 Faculty department:', user?.department);
  console.log('🔬 Faculty specialization:', user?.specialization);

  const getDesignationInfo = () => {
    const designation = user?.designation?.toLowerCase() || '';
    console.log('🎯 Processing designation:', designation);
    
    if (designation.includes('principal') || designation.includes('dean')) {
      return { 
        color: 'from-yellow-500 to-orange-600', 
        icon: '👑', 
        title: 'Principal',
        description: 'Institutional Leader & Visionary'
      };
    } else if (designation.includes('hod') || designation.includes('head') || designation.includes('director')) {
      return { 
        color: 'from-purple-500 to-indigo-600', 
        icon: '⭐', 
        title: 'Head of Department',
        description: 'Departmental Leader & Innovation Champion'
      };
    } else if (designation.includes('professor')) {
      return { 
        color: 'from-blue-500 to-cyan-600', 
        icon: '🎓', 
        title: 'Professor',
        description: 'Research Leader & Academic Mentor'
      };
    } else {
      return { 
        color: 'from-emerald-500 to-teal-600', 
        icon: '👨‍🏫', 
        title: 'Faculty Member',
        description: 'Education Specialist & Student Mentor'
      };
    }
  };

  const designationInfo = getDesignationInfo();

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

  const handleViewInvitation = () => {
    setShowInvitation(true);
  };

  const handleInvitationComplete = () => {
    setShowInvitation(false);
  };

  return (
    <FacultyLayout>
      {/* Navigation */}
      <Navigation />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <div className="relative z-10 p-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Faculty Profile
              </h1>
              <p className="text-xl text-gray-300">
                Your academic profile and credentials for Innoverse 2025
              </p>
            </motion.div>

            {/* Profile Card */}
            <motion.div variants={itemVariants} className="mb-8">
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-emerald-500/20 backdrop-blur-sm">
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Profile Picture and Basic Info */}
                    <div className="text-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${designationInfo.color} flex items-center justify-center text-6xl shadow-2xl`}
                      >
                        {designationInfo.icon}
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
                      <Badge className={`bg-gradient-to-r ${designationInfo.color} text-white px-4 py-2 text-sm`}>
                        {designationInfo.title}
                      </Badge>
                      <p className="text-gray-400 mt-2 text-sm">{designationInfo.description}</p>
                    </div>

                    {/* Academic Details */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-semibold text-emerald-400 mb-4">📋 Academic Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <h4 className="font-medium text-white mb-2">🏢 Department</h4>
                          <p className="text-gray-300">{user?.department || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <h4 className="font-medium text-white mb-2">🎯 Designation</h4>
                          <p className="text-gray-300">{user?.designation || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <h4 className="font-medium text-white mb-2">📧 Email</h4>
                          <p className="text-gray-300">{user?.email || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <h4 className="font-medium text-white mb-2">🔬 Specialization</h4>
                          <p className="text-gray-300">{user?.specialization || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/20 p-6 backdrop-blur-sm h-full">
                  <h3 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center">
                    <span className="text-2xl mr-3">✨</span>
                    View Invitation
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    View your personalized invitation to Innoverse 2025 with formal presentation and event details.
                  </p>
                  <Button
                    onClick={handleViewInvitation}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  >
                    🎊 View Invitation
                  </Button>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/20 p-6 backdrop-blur-sm h-full">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                    <span className="text-2xl mr-3">👥</span>
                    Teams Overview
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Quick access to view all registered teams and their innovative project submissions.
                  </p>
                  <Button
                    onClick={() => window.location.href = '/faculty/teams'}
                    variant="outline"
                    className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-600/10"
                  >
                    📋 View Teams
                  </Button>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Card className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 p-6 backdrop-blur-sm h-full">
                  <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center">
                    <span className="text-2xl mr-3">📊</span>
                    Evaluations
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    Access evaluation results and team rankings for the innovation showcase competition.
                  </p>
                  <Button
                    onClick={() => window.location.href = '/faculty/evaluation'}
                    variant="outline"
                    className="w-full border-orange-500/50 text-orange-400 hover:bg-orange-600/10"
                  >
                    ⭐ View Results
                  </Button>
                </Card>
              </motion.div>
            </motion.div>

            {/* Event Information */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 backdrop-blur-sm">
                <div className="p-6 border-b border-gray-700/50">
                  <h3 className="text-2xl font-semibold text-white flex items-center">
                    <span className="text-3xl mr-3">🎯</span>
                    Innoverse 2025 - Event Information
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-emerald-400 mb-3">📅 Event Schedule</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                          <span className="text-2xl">🚀</span>
                          <div>
                            <p className="font-medium text-white">Innoverse Showcase</p>
                            <p className="text-gray-400 text-sm">September 17, 2025 | 9:00 AM - 6:00 PM</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                          <span className="text-2xl">🍽️</span>
                          <div>
                            <p className="font-medium text-white">Potluck Celebration</p>
                            <p className="text-gray-400 text-sm">September 17, 2025 | 6:00 PM - 8:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-emerald-400 mb-3">🏆 Your Role</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-700/30 rounded-lg">
                          <p className="font-medium text-white mb-2">Faculty Responsibilities</p>
                          <ul className="text-gray-300 text-sm space-y-1">
                            <li>• Guide and mentor participating teams</li>
                            <li>• Review team submissions and problem statements</li>
                            <li>• Provide feedback on innovation projects</li>
                            <li>• Support evaluation and judging process</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Faculty Invitation Modal */}
        {showInvitation && (
          <FacultyInvitation
            facultyData={{
              name: user?.name || 'Faculty Member',
              email: user?.email || 'faculty@example.com',
              department: user?.department || 'Academic Department',
              designation: user?.designation || 'Faculty',
              specialization: user?.specialization || 'Education'
            }}
            onComplete={handleInvitationComplete}
          />
        )}
      </div>
    </FacultyLayout>
  );
}

export default FacultyProfile;

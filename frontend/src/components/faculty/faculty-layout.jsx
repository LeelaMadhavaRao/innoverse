import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { useAuth } from '../../context/auth-context';
import FacultySidebar from './faculty-sidebar';

function FacultyLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getDesignationBadge = () => {
    const designation = user?.designation?.toLowerCase() || '';
    
    if (designation.includes('principal') || designation.includes('dean')) {
      return { color: 'from-yellow-500 to-orange-600', icon: '👑', title: 'Principal' };
    } else if (designation.includes('hod') || designation.includes('head') || designation.includes('director')) {
      return { color: 'from-purple-500 to-indigo-600', icon: '⭐', title: 'HOD' };
    } else if (designation.includes('professor')) {
      return { color: 'from-blue-500 to-cyan-600', icon: '🎓', title: 'Professor' };
    } else {
      return { color: 'from-emerald-500 to-teal-600', icon: '👨‍🏫', title: 'Faculty' };
    }
  };

  const designationBadge = getDesignationBadge();

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <FacultySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <nav className="bg-gray-800 border-b border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link to="/faculty" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Faculty Portal
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Enhanced User Profile Card */}
              <div className="hidden md:flex items-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-4 border border-gray-600 shadow-xl cursor-pointer"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="flex items-center space-x-4">
                    {/* Profile Avatar */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${designationBadge.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                      </span>
                    </div>
                    
                    {/* User Details */}
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-semibold text-sm">{user?.name || 'Faculty Member'}</span>
                        <Badge className={`bg-gradient-to-r ${designationBadge.color} text-white text-xs px-2 py-1`}>
                          {designationBadge.icon} {designationBadge.title}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-400">
                        {user?.department || 'Department'} • {user?.email || 'faculty@example.com'}
                      </div>
                      <div className="text-xs text-purple-400 mt-1">
                        🏛️ Faculty Portal
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mb-1"></div>
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Profile Summary */}
              <div className="md:hidden flex items-center space-x-2">
                <div className={`w-10 h-10 bg-gradient-to-br ${designationBadge.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{user?.name || 'Faculty'}</div>
                  <div className="text-xs text-gray-400">{designationBadge.title}</div>
                </div>
              </div>

              {/* Logout button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto relative">
          {/* Enhanced Profile Modal */}
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-4 right-4 z-50"
            >
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 p-6 shadow-2xl backdrop-blur-lg">
                <div className="w-80">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      {designationBadge.icon} Faculty Profile
                    </h3>
                    <button
                      onClick={() => setShowProfile(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${designationBadge.color} rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                        {user?.name?.charAt(0)?.toUpperCase() || 'F'}
                      </div>
                      <h4 className="text-lg font-semibold text-white">{user?.name || 'Faculty Member'}</h4>
                      <Badge className={`bg-gradient-to-r ${designationBadge.color} text-white mt-2`}>
                        {designationBadge.icon} {designationBadge.title}
                      </Badge>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 w-20">📧 Email:</span>
                        <span className="text-white">{user?.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 w-20">🏢 Dept:</span>
                        <span className="text-white">{user?.department || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-400 w-20">💼 Role:</span>
                        <span className="text-white">{user?.designation || 'Faculty Member'}</span>
                      </div>
                      {user?.specialization && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-400 w-20">🎯 Spec:</span>
                          <span className="text-white">{user.specialization}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4 border border-purple-500/20">
                      <div className="text-center">
                        <div className="text-purple-400 text-sm mb-2">🏛️ Portal Access Level</div>
                        <div className="text-white font-semibold">{designationBadge.title} Dashboard</div>
                        <div className="text-purple-300 text-xs mt-1">Full faculty privileges enabled</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default FacultyLayout;

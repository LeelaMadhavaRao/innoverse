import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useAuth } from '../../context/auth-context';

function FacultyLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navigationItems = [
    { 
      path: '/faculty', 
      label: 'Home', 
      icon: '🏠',
      isActive: location.pathname === '/faculty'
    },
    { 
      path: '/faculty/profile', 
      label: 'Profile', 
      icon: '👤',
      isActive: location.pathname === '/faculty/profile'
    },
    { 
      path: '/faculty/teams', 
      label: 'Teams', 
      icon: '👥',
      isActive: location.pathname === '/faculty/teams'
    },
    { 
      path: '/faculty/evaluation', 
      label: 'Evaluation', 
      icon: '📊',
      isActive: location.pathname === '/faculty/evaluation'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Header */}
      <nav className="bg-gradient-to-r from-gray-800/90 via-gray-900/90 to-gray-800/90 backdrop-blur-lg border-b border-emerald-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Innoverse 2025
                  </span>
                  <div className="text-xs text-emerald-400">Faculty Portal</div>
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    item.isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              {/* Simple User Info */}
              <div className="hidden md:flex items-center space-x-3 text-white">
                <div className="text-right">
                  <div className="font-medium">{user?.name || 'Faculty User'}</div>
                  <div className="text-emerald-400 text-sm">{user?.email || 'faculty@innoverse.com'}</div>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-600/10 hover:border-red-400"
              >
                <span className="mr-2">🚪</span>
                Logout
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-gray-300 hover:text-emerald-400 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 border-t border-emerald-500/20"
            >
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      item.isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                        : 'text-gray-300 hover:text-emerald-400 hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {/* Mobile User Info */}
                <div className="px-4 py-3 border-t border-emerald-500/20 mt-4">
                  <div className="text-white font-medium">{user?.name || 'Faculty User'}</div>
                  <div className="text-emerald-400 text-sm">{user?.email || 'faculty@innoverse.com'}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {children}
      </main>
    </div>
  );
}

export default FacultyLayout;

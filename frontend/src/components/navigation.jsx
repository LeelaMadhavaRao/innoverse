import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../context/auth-context';
import { motion, AnimatePresence } from 'framer-motion';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavClick = (item) => {
    if (item.isScroll) {
      // If it's a scroll item, navigate to home first then scroll
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector('#evaluation');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.querySelector('#evaluation');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setIsMenuOpen(false);
  };

  // Get navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { path: '/', label: 'Home', icon: '🏠' },
      { path: '/gallery', label: 'Gallery', icon: '🖼️' },
      { path: '/#evaluation', label: 'Evaluation Criteria', icon: '⭐', isScroll: true },
    ];

    if (!isAuthenticated) {
      return [
        ...commonItems,
        { path: '/login', label: 'Login', icon: '🔐', isButton: true }
      ];
    }

    const roleSpecificItems = {
      admin: [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/poster-launch', label: 'Poster Launch', icon: '🚀' },
        { path: '/admin/users', label: 'Users', icon: '👥' },
        { path: '/admin/teams', label: 'Teams', icon: '🏆' },
        { path: '/admin/evaluators', label: 'Evaluators', icon: '⭐' },
      ],
      team: [
        { path: '/team/profile', label: 'Profile', icon: '👤' },
        { path: '/team/results', label: 'Results', icon: '📈' },
      ],
      evaluator: [
        { path: '/evaluator/profile', label: 'Profile', icon: '👤' },
        { path: '/evaluator/evaluations', label: 'Evaluations', icon: '📝' },
      ],
      faculty: [
        { path: '/faculty/profile', label: 'Profile', icon: '👤' },
        { path: '/faculty/teams', label: 'Teams', icon: '🎓' },
        { path: '/faculty/evaluation', label: 'Evaluation', icon: '📊' },
        { path: '/faculty/results', label: 'Results', icon: '🏆' },
      ]
    };

    return [
      ...commonItems,
      ...(roleSpecificItems[user?.role] || [])
    ];
  };

  const getUserBadgeColor = () => {
    const colors = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/30',
      team: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      evaluator: 'bg-green-500/20 text-green-400 border-green-500/30',
      faculty: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[user?.role] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.img
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              src="/innoverse_logo.jpg"
              alt="Innoverse Logo"
              className="w-10 h-10 rounded-xl shadow-lg object-cover"
              style={{ background: 'white' }}
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Innoverse 2025
              </h1>
              <p className="text-xs text-gray-400">Innovation Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              if (item.isButton && !isAuthenticated) {
                return (
                  <Button key={item.path} asChild variant="default" size="sm" className="ml-4">
                    <Link to={item.path} className="flex items-center space-x-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                );
              }

              if (item.isScroll) {
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              }

              const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Info & Logout (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-4">
              <Badge className={`${getUserBadgeColor()} border`}>
                {user?.role?.toUpperCase()}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
              >
                🚪 Logout
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
          >
            <motion.div
              animate={isMenuOpen ? "open" : "closed"}
              className="w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                variants={{
                  open: { rotate: 45, y: 6 },
                  closed: { rotate: 0, y: 0 }
                }}
                className="w-6 h-0.5 bg-white block absolute"
              />
              <motion.span
                variants={{
                  open: { opacity: 0 },
                  closed: { opacity: 1 }
                }}
                className="w-6 h-0.5 bg-white block absolute"
              />
              <motion.span
                variants={{
                  open: { rotate: -45, y: -6 },
                  closed: { rotate: 0, y: 0 }
                }}
                className="w-6 h-0.5 bg-white block absolute"
              />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/98 backdrop-blur-lg border-t border-gray-800/50"
          >
            <div className="px-4 py-4 space-y-2">
              {/* User Info (Mobile) */}
              {isAuthenticated && (
                <div className="border-b border-gray-800/50 pb-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge className={`${getUserBadgeColor()} border`}>
                      {user?.role?.toUpperCase()}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items (Mobile) */}
              {navigationItems.map((item) => {
                if (item.isButton && !isAuthenticated) {
                  return (
                    <Button key={item.path} asChild variant="default" size="sm" className="w-full justify-start">
                      <Link to={item.path} onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-2">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  );
                }

                if (item.isScroll) {
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavClick(item)}
                      className="w-full text-left block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800/50"
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                }

                const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                      isActive
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Logout (Mobile) */}
              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 mt-4"
                >
                  🚪 Logout
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navigation;

import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function FacultySidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/faculty',
      icon: '🏠',
      current: location.pathname === '/faculty'
    },
    {
      name: 'Teams Overview',
      href: '/faculty/teams',
      icon: '👥',
      current: location.pathname === '/faculty/teams'
    },
    {
      name: 'Evaluations',
      href: '/faculty/evaluations',
      icon: '📊',
      current: location.pathname === '/faculty/evaluations'
    },
    {
      name: 'Reports',
      href: '/faculty/reports',
      icon: '📋',
      current: location.pathname === '/faculty/reports'
    },
    {
      name: 'Gallery',
      href: '/faculty/gallery',
      icon: '🖼️',
      current: location.pathname === '/faculty/gallery'
    },
    {
      name: 'Settings',
      href: '/faculty/settings',
      icon: '⚙️',
      current: location.pathname === '/faculty/settings'
    }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  };

  return (
    <motion.div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:inset-0 transition-transform duration-200 ease-in-out`}
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      initial="closed"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-lg font-semibold text-white">Faculty</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                item.current
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <motion.span 
                className="mr-4 text-xl"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {item.icon}
              </motion.span>
              <span className="flex-1">{item.name}</span>
              
              {item.current && (
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Innoverse 2025</div>
                <div className="text-xs text-gray-400">Faculty Portal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default FacultySidebar;

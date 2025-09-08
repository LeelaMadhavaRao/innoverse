import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useAuth } from '../../context/auth-context';

function AdminSidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/teams', label: 'Team Management', icon: '👥' },
    { path: '/admin/faculty', label: 'Faculty Management', icon: '🎓' },
    { path: '/admin/evaluators', label: 'Evaluator Management', icon: '⭐' },
    { path: '/admin/evaluations', label: 'Evaluation Management', icon: '📊' },
    { path: '/admin/users', label: 'All Users', icon: '👤' },
    { path: '/admin/emails', label: 'Email System', icon: '📧' },
    { path: '/admin/gallery', label: 'Event Gallery', icon: '🖼️' },
    { path: '/admin/poster-launch', label: 'Poster Launch', icon: '🚀' },
    { path: '/admin/certificates', label: 'Merit Certificates', icon: '🏆' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 z-40">
        <div className="h-full flex flex-col">
          {/* Scrollable Content */}
          <div 
            className="flex-1 overflow-y-scroll admin-scrollbar-desktop"
            style={{
              height: 'calc(100vh - 130px)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#6b7280 #374151'
            }}
          >
            <div className="p-6">
              {/* Logo */}
              <Link to="/admin" className="flex items-center space-x-2 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Admin Panel
                  </span>
                  <div className="text-xs text-gray-400">Innoverse 2025</div>
                </div>
              </Link>

              {/* Navigation */}
              <nav className="space-y-2 mb-8">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path}>
                    <motion.div 
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      {isActive(item.path) && (
                        <motion.div
                          className="w-2 h-2 bg-white rounded-full ml-auto"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/admin/teams/create">
                    <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      ➕ Create Team
                    </Button>
                  </Link>
                  <Link to="/admin/gallery/upload">
                    <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      📸 Upload Photos
                    </Button>
                  </Link>
                  <Link to="/gallery">
                    <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      🖼️ View Public Gallery
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      🏠 Back to Home
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Test Content for Scrolling */}
              <div className="pt-6 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Test Scrolling</h3>
                <div className="space-y-3">
                  {[1,2,3,4,5,6,7,8,9,10].map(i => (
                    <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                      <p className="text-sm text-gray-300">Test Item {i}</p>
                      <p className="text-xs text-gray-500">Scroll test content</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed User Section */}
          <div className="bg-gray-800 border-t border-gray-700 p-6" style={{ height: '130px', flexShrink: 0 }}>
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Administrator</p>
                  <p className="text-gray-300 text-xs">admin@innoverse.com</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm" 
                  className="w-full border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white"
                >
                  🚪 Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-gray-800 border-r border-gray-700 z-50"
          >
            <div className="h-full flex flex-col">
              {/* Mobile Scrollable Content */}
              <div 
                className="flex-1 overflow-y-scroll admin-scrollbar-mobile"
                style={{
                  height: 'calc(100vh - 120px)',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#6b7280 #374151'
                }}
              >
                <div className="p-6">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Link to="/admin" onClick={handleLinkClick} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">I</span>
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Admin
                      </span>
                    </Link>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-1 mb-6">
                    {menuItems.map((item) => (
                      <Link key={item.path} to={item.path} onClick={handleLinkClick}>
                        <motion.div 
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="font-medium text-sm">{item.label}</span>
                        </motion.div>
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Quick Actions */}
                  <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-xs font-semibold text-gray-400 mb-2">Quick Actions</h3>
                    <div className="space-y-1">
                      <Link to="/gallery" onClick={handleLinkClick}>
                        <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                          🖼️ View Gallery
                        </Button>
                      </Link>
                      <Link to="/" onClick={handleLinkClick}>
                        <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 text-xs">
                          🏠 Back to Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Fixed User Section */}
              <div className="bg-gray-800 border-t border-gray-700 p-4" style={{ height: '120px', flexShrink: 0 }}>
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">A</span>
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">Administrator</p>
                      <p className="text-gray-300 text-xs">admin@innoverse.com</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      handleLogout();
                      setIsSidebarOpen(false);
                    }}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white text-xs"
                  >
                    🚪 Logout
                  </Button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default AdminSidebar;

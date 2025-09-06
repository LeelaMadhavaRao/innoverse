import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useAuth } from '../../context/auth-context';

function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '🏠' },
    { path: '/admin/teams', label: 'Team Management', icon: '👥' },
    { path: '/admin/faculty', label: 'Faculty Management', icon: '🎓' },
    { path: '/admin/evaluators', label: 'Evaluator Management', icon: '⭐' },
    { path: '/admin/evaluations', label: 'Evaluation Scores', icon: '�' },
    { path: '/admin/gallery', label: 'Event Gallery', icon: '🖼️' },
    { path: '/admin/emails', label: 'Email System', icon: '📧' },
    { path: '/admin/users', label: 'All Users', icon: '👤' },
    { path: '/admin/poster-launch', label: 'Poster Launch', icon: '🚀' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-40 overflow-y-auto">
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
        <div className="mb-8 pt-6 border-t border-gray-700">
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
                �️ View Public Gallery
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                🏠 Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-4 mb-4">
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
  );
}

export default AdminSidebar;

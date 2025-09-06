import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { authAPI } from '../lib/api';
import { useAuth } from '../context/auth-context';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      type: 'team',
      title: 'Team Login',
      description: 'Access your team dashboard and submit your startup ideas',
      icon: '👥',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-900/30 to-teal-900/30',
      borderColor: 'border-emerald-500/30'
    },
    {
      type: 'faculty',
      title: 'Faculty Login',
      description: 'Monitor teams and view evaluation progress',
      icon: '🎓',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-900/30 to-pink-900/30',
      borderColor: 'border-purple-500/30'
    },
    {
      type: 'evaluator',
      title: 'Evaluator Login',
      description: 'Evaluate team presentations and score submissions',
      icon: '⭐',
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-900/30 to-red-900/30',
      borderColor: 'border-orange-500/30'
    },
    {
      type: 'admin',
      title: 'Admin Login',
      description: 'Manage users, events, and system administration',
      icon: '⚙️',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-900/30 to-indigo-900/30',
      borderColor: 'border-blue-500/30'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        // Get user from auth context after login
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          // Redirect based on user role
          switch(userData.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'team':
              navigate('/team');
              break;
            case 'evaluator':
              navigate('/evaluator');
              break;
            case 'faculty':
              navigate('/faculty');
              break;
            default:
              navigate('/');
              break;
          }
        } else {
          navigate('/');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-purple-900/20 to-blue-900/20"></div>
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-white font-bold text-2xl">I</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Innoverse 2025</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Select your role to access the appropriate dashboard and features
            </p>
          </motion.div>

          {/* Role Selection */}
          <motion.div 
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-6"
          >
            {roles.map((role, index) => (
              <motion.div
                key={role.type}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRole(role)}
                className={`bg-gradient-to-br ${role.bgColor} p-8 rounded-3xl border ${role.borderColor} backdrop-blur-sm cursor-pointer group hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${role.color} rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{role.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{role.description}</p>
                  
                  <div className="mt-6">
                    <Button className={`bg-gradient-to-r ${role.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200`}>
                      Continue as {role.type === 'admin' ? 'Admin' : role.type === 'faculty' ? 'Faculty' : role.type === 'evaluator' ? 'Evaluator' : 'Team'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Back to Home */}
          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${selectedRole.bgColor}`}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          onClick={() => setSelectedRole(null)}
          className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
          whileHover={{ x: -5 }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to role selection
        </motion.button>

        <Card className={`bg-gradient-to-br ${selectedRole.bgColor} border ${selectedRole.borderColor} backdrop-blur-sm shadow-2xl`}>
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-16 h-16 bg-gradient-to-br ${selectedRole.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-xl`}>
                {selectedRole.icon}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">{selectedRole.title}</h2>
              <Badge className={`${selectedRole.borderColor} text-gray-300 bg-black/20`}>
                Innoverse 2025
              </Badge>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 backdrop-blur-sm"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 backdrop-blur-sm"
                  placeholder="Enter your password"
                />
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r ${selectedRole.color} hover:shadow-lg text-white font-semibold py-3 text-lg transition-all duration-200`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    `Sign in as ${selectedRole.type === 'admin' ? 'Admin' : selectedRole.type === 'faculty' ? 'Faculty' : selectedRole.type === 'evaluator' ? 'Evaluator' : 'Team'}`
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Having trouble signing in?{' '}
                <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">
                  Contact support
                </span>
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            ← Return to homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;

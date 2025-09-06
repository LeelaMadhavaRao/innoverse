import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Add a verify token endpoint in the backend
      // For now, we'll just set the user from localStorage
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
        setUser(savedUser);
        setIsAuthenticated(true);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('🔄 Attempting login with:', { email: credentials.email });
      const response = await authAPI.login(credentials);
      console.log('📡 API response:', response);
      
      const { token, user } = response.data;
      console.log('✅ Login successful:', { user: user.name, role: user.role });
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('📄 Error response:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

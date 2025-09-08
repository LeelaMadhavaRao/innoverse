import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for:', email);

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [
        { email },
        { username: email } // Allow login with username as well
      ]
    });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      
      // Update login count and last login
      user.loginCount = (user.loginCount || 0) + 1;
      user.lastLogin = new Date();
      await user.save();

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          status: user.status,
          loginCount: user.loginCount
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email/username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, username } = req.body;
    
    const userExists = await User.findOne({ 
      $or: [
        { email },
        { username: username || email }
      ]
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ 
      name, 
      email, 
      username: username || email,
      password, 
      role 
    });
    
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout user
export const logoutUser = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

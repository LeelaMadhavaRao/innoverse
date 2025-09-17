// Check evaluator user account and fix authentication
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://leelamadhav:0926@innoverse.qz6bs.mongodb.net/innoverse', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'team', 'faculty', 'evaluator'], required: true },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const checkEvaluatorUser = async () => {
  try {
    const evaluatorEmail = 'leelamadhav.nulakani@gmail.com';
    
    console.log('🔍 Looking for user account with email:', evaluatorEmail);
    
    // Find user account
    const user = await User.findOne({ email: evaluatorEmail });
    
    if (user) {
      console.log('✅ User account found:');
      console.log('- Name:', user.name);
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('- Active:', user.isActive);
      console.log('- Created:', user.createdAt);
      console.log('- Last Login:', user.lastLogin);
      
      // Check if role is evaluator
      if (user.role !== 'evaluator') {
        console.log('⚠️ User role is not "evaluator", updating...');
        await User.findByIdAndUpdate(user._id, { 
          role: 'evaluator',
          updatedAt: new Date()
        });
        console.log('✅ User role updated to "evaluator"');
      }
      
      // Check if account is active
      if (!user.isActive) {
        console.log('⚠️ User account is inactive, activating...');
        await User.findByIdAndUpdate(user._id, { 
          isActive: true,
          updatedAt: new Date()
        });
        console.log('✅ User account activated');
      }
      
    } else {
      console.log('❌ No user account found with email:', evaluatorEmail);
      console.log('🔧 Creating user account...');
      
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('evaluator123', 12);
      
      const newUser = new User({
        name: 'suresh',
        email: evaluatorEmail,
        password: hashedPassword,
        role: 'evaluator',
        isActive: true
      });
      
      await newUser.save();
      console.log('✅ User account created successfully');
    }
    
    // Test password if provided
    if (user) {
      const bcrypt = require('bcryptjs');
      const passwordMatch = await bcrypt.compare('evaluator123', user.password);
      console.log('🔐 Password check for "evaluator123":', passwordMatch ? '✅ VALID' : '❌ INVALID');
      
      if (!passwordMatch) {
        console.log('🔧 Updating password to "evaluator123"...');
        const hashedPassword = await bcrypt.hash('evaluator123', 12);
        await User.findByIdAndUpdate(user._id, { 
          password: hashedPassword,
          updatedAt: new Date()
        });
        console.log('✅ Password updated successfully');
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking evaluator user:', error);
  } finally {
    mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
};

connectDB().then(checkEvaluatorUser);
// Fix duplicate user accounts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://leelamadhavnulakani:9133603383@cluster0.fhipcg5.mongodb.net/innoverse?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri);
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

const fixDuplicateUsers = async () => {
  try {
    const evaluatorEmail = 'leelamadhav.nulakani@gmail.com';
    
    console.log('🔍 Looking for all user accounts with email:', evaluatorEmail);
    
    // Find all user accounts with this email
    const users = await User.find({ email: evaluatorEmail });
    
    console.log(`Found ${users.length} users with this email:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}, Name: ${user.name}, Role: ${user.role}, Active: ${user.isActive}`);
    });
    
    // Find the evaluator user and faculty user
    const facultyUser = users.find(u => u.role === 'faculty');
    const evaluatorUser = users.find(u => u.role === 'evaluator');
    
    if (facultyUser && evaluatorUser) {
      console.log('⚠️ Both faculty and evaluator accounts exist');
      console.log('🔧 Keeping evaluator account, deleting faculty account...');
      await User.findByIdAndDelete(facultyUser._id);
      console.log('✅ Faculty account deleted');
      
      // Ensure evaluator account has correct password
      const passwordMatch = await bcrypt.compare('evaluator123', evaluatorUser.password);
      console.log('🔐 Evaluator password check:', passwordMatch ? '✅ VALID' : '❌ INVALID');
      
      if (!passwordMatch) {
        console.log('🔧 Updating evaluator password...');
        const hashedPassword = await bcrypt.hash('evaluator123', 12);
        await User.findByIdAndUpdate(evaluatorUser._id, { 
          password: hashedPassword,
          updatedAt: new Date()
        });
        console.log('✅ Evaluator password updated');
      }
      
    } else if (facultyUser && !evaluatorUser) {
      console.log('⚠️ Only faculty account exists, converting to evaluator...');
      await User.findByIdAndUpdate(facultyUser._id, { 
        role: 'evaluator',
        name: 'suresh', // Update name to match evaluator profile
        updatedAt: new Date()
      });
      console.log('✅ Faculty account converted to evaluator');
      
      // Set correct password
      const hashedPassword = await bcrypt.hash('evaluator123', 12);
      await User.findByIdAndUpdate(facultyUser._id, { 
        password: hashedPassword,
        updatedAt: new Date()
      });
      console.log('✅ Password set to "evaluator123"');
      
    } else if (!facultyUser && evaluatorUser) {
      console.log('✅ Only evaluator account exists');
      
      // Check password
      const passwordMatch = await bcrypt.compare('evaluator123', evaluatorUser.password);
      console.log('🔐 Password check:', passwordMatch ? '✅ VALID' : '❌ INVALID');
      
      if (!passwordMatch) {
        console.log('🔧 Updating password...');
        const hashedPassword = await bcrypt.hash('evaluator123', 12);
        await User.findByIdAndUpdate(evaluatorUser._id, { 
          password: hashedPassword,
          updatedAt: new Date()
        });
        console.log('✅ Password updated');
      }
    } else {
      console.log('❌ No user accounts found');
    }
    
    // Final verification
    console.log('\n🔍 Final verification:');
    const finalUser = await User.findOne({ email: evaluatorEmail, role: 'evaluator' });
    if (finalUser) {
      console.log('✅ Evaluator account exists');
      console.log('- Name:', finalUser.name);
      console.log('- Email:', finalUser.email);
      console.log('- Role:', finalUser.role);
      console.log('- Active:', finalUser.isActive);
      
      const passwordCheck = await bcrypt.compare('evaluator123', finalUser.password);
      console.log('- Password "evaluator123":', passwordCheck ? '✅ VALID' : '❌ INVALID');
    } else {
      console.log('❌ No evaluator account found after fixing');
    }
    
  } catch (error) {
    console.error('❌ Error fixing duplicate users:', error);
  } finally {
    mongoose.disconnect();
    console.log('🔌 MongoDB disconnected');
  }
};

connectDB().then(fixDuplicateUsers);
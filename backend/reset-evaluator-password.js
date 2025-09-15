import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';

dotenv.config();

const resetEvaluatorPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'leelamadhav.nulakani@gmail.com';
    const newPassword = 'evaluator123'; // Known password for testing

    // Find the evaluator user
    const user = await User.findOne({ email, role: 'evaluator' });
    
    if (!user) {
      console.log('❌ Evaluator user not found');
      return;
    }

    console.log('👤 Found evaluator user:', user.name);
    console.log('📧 Email:', user.email);
    console.log('🔒 Current password hash:', user.password);

    // Update password
    user.password = newPassword;
    await user.save(); // This will trigger the pre-save middleware to hash the password

    console.log('✅ Password updated successfully');
    console.log('🔑 New password:', newPassword);
    console.log('🔒 New password hash:', user.password);

    // Test the new password
    const isMatch = await user.matchPassword(newPassword);
    console.log('✅ Password verification test:', isMatch);

    if (isMatch) {
      console.log('🎉 Password reset successful! You can now login with:');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Password: ${newPassword}`);
      console.log(`👥 Role: evaluator`);
    }

  } catch (error) {
    console.error('❌ Password reset failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the reset
resetEvaluatorPassword();
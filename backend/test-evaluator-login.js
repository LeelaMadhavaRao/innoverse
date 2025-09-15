import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';
import Evaluator from './src/models/evaluator.model.js';

dotenv.config();

const testEvaluatorLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const testEmail = 'test.evaluator@example.com';
    const testPassword = 'testpass123';

    // Check if evaluator already exists
    let user = await User.findOne({ email: testEmail, role: 'evaluator' });
    
    if (!user) {
      console.log('🆕 Creating test evaluator...');
      
      // Create user
      user = await User.create({
        name: 'Test Evaluator',
        email: testEmail,
        password: testPassword,
        role: 'evaluator'
      });
      
      // Create evaluator profile
      const evaluator = await Evaluator.create({
        name: 'Test Evaluator',
        email: testEmail,
        userId: user._id,
        organization: 'Test Org',
        type: 'internal',
        status: 'active'
      });
      
      user.evaluatorProfile = evaluator._id;
      await user.save();
      
      console.log('✅ Test evaluator created');
    } else {
      console.log('📋 Test evaluator already exists');
    }

    // Test password verification
    console.log('🔍 Testing password verification...');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    console.log('👥 Role:', user.role);
    console.log('🆔 User ID:', user._id);
    
    // Check stored password hash
    console.log('🔒 Stored hash:', user.password);
    
    // Test password match
    const isMatch = await user.matchPassword(testPassword);
    console.log('✅ Password match result:', isMatch);

    if (isMatch) {
      console.log('🎉 Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
      
      // Try manual verification
      const bcrypt = (await import('bcryptjs')).default;
      const manualMatch = await bcrypt.compare(testPassword, user.password);
      console.log('🔍 Manual bcrypt comparison:', manualMatch);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the test
testEvaluatorLogin();
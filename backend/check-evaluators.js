import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/user.model.js';
import Evaluator from './src/models/evaluator.model.js';

dotenv.config();

const checkEvaluatorCredentials = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check for evaluators in the database
    const evaluators = await Evaluator.find().populate('userId');
    console.log(`📋 Found ${evaluators.length} evaluator(s) in database:`);
    
    for (const evaluator of evaluators) {
      console.log('\n--- Evaluator Details ---');
      console.log('📧 Email:', evaluator.email);
      console.log('👤 Name:', evaluator.name);
      console.log('🏢 Organization:', evaluator.organization);
      console.log('🔑 Type:', evaluator.type);
      console.log('📅 Created:', evaluator.createdAt);
      
      if (evaluator.userId) {
        console.log('--- Linked User Account ---');
        console.log('🆔 User ID:', evaluator.userId._id);
        console.log('📧 User Email:', evaluator.userId.email);
        console.log('👥 User Role:', evaluator.userId.role);
        console.log('🔒 Password Hash:', evaluator.userId.password);
        console.log('📅 User Created:', evaluator.userId.createdAt);
        
        // Test if password verification method exists
        try {
          const testPassword = 'test123';
          const hasMatchMethod = typeof evaluator.userId.matchPassword === 'function';
          console.log('🔧 Has matchPassword method:', hasMatchMethod);
          
          if (hasMatchMethod) {
            // Try a test password
            const testResult = await evaluator.userId.matchPassword(testPassword);
            console.log('🧪 Test password verification (with "test123"):', testResult);
          }
        } catch (testError) {
          console.log('❌ Error testing password method:', testError.message);
        }
      } else {
        console.log('❌ No linked user account found!');
      }
    }

    // Also check for any users with evaluator role directly
    const evaluatorUsers = await User.find({ role: 'evaluator' });
    console.log(`\n👥 Found ${evaluatorUsers.length} user(s) with evaluator role:`);
    
    for (const user of evaluatorUsers) {
      console.log('\n--- Evaluator User ---');
      console.log('📧 Email:', user.email);
      console.log('👤 Name:', user.name);
      console.log('👥 Role:', user.role);
      console.log('🔒 Password Hash:', user.password);
      console.log('🆔 Evaluator Profile ID:', user.evaluatorProfile);
    }

  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

// Run the check
checkEvaluatorCredentials();
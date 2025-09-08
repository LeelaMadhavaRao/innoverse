// Team Leader Password Debug Script
// Run this from the backend directory: cd backend && node ../debug-team-auth.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './backend/src/models/user.model.js';
import Team from './backend/src/models/team.model.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './backend/.env' });

// Connect to database
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/innoverse_dev';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

async function debugTeamLeaderAuth() {
  try {
    await connectDB();
    console.log('🔍 Checking team leader authentication issues...\n');
    
    // Get all team leaders
    const teamLeaders = await User.find({ role: 'team' }).sort({ name: 1 });
    console.log(`Found ${teamLeaders.length} team users:\n`);
    
    for (const leader of teamLeaders) {
      const isLeader = leader.isTeamLeader || false;
      console.log(`👤 ${leader.name} (${leader.email}) - ${isLeader ? 'LEADER' : 'MEMBER'}`);
      console.log(`   Password Hash: ${leader.password ? 'EXISTS' : 'MISSING'}`);
      console.log(`   Hash Length: ${leader.password ? leader.password.length : 0}`);
      console.log(`   Team: ${leader.teamName || 'NOT SET'}`);
      console.log(`   Status: ${leader.status || 'NOT SET'}`);
      
      if (isLeader) {
        // Check if there's a corresponding team
        const team = await Team.findOne({ 'teamLeader.email': leader.email });
        if (team) {
          console.log(`   ✅ Team Found: ${team.teamName}`);
          console.log(`   Team Credentials: ${team.credentials ? 'EXISTS' : 'MISSING'}`);
          if (team.credentials) {
            console.log(`   Stored Password: ${team.credentials.password}`);
            console.log(`   Username: ${team.credentials.username}`);
          }
        } else {
          console.log(`   ❌ No team found for this leader`);
        }
      }
      console.log('');
    }
    
  } catch (error) {
    console.error('Debug failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Database connection closed');
  }
}

async function resetTeamLeaderPassword(email, newPassword) {
  try {
    await connectDB();
    console.log(`🔐 Resetting password for ${email}...`);
    
    // Generate hash
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user record
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return false;
    }
    
    // Update team credentials
    const team = await Team.findOneAndUpdate(
      { 'teamLeader.email': email },
      { 
        'credentials.password': newPassword,
        'credentials.username': email
      },
      { new: true }
    );
    
    if (!team) {
      console.log(`❌ Team not found for leader: ${email}`);
      return false;
    }
    
    console.log(`✅ Password reset successful for ${email}`);
    console.log(`   New password: ${newPassword}`);
    console.log(`   Team: ${team.teamName}`);
    
    return true;
    
  } catch (error) {
    console.error('Password reset failed:', error);
    return false;
  } finally {
    await mongoose.disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);

if (args[0] === 'debug') {
  debugTeamLeaderAuth();
} else if (args[0] === 'reset' && args[1] && args[2]) {
  resetTeamLeaderPassword(args[1], args[2])
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  console.log('Usage:');
  console.log('  node debug-team-auth.js debug');
  console.log('  node debug-team-auth.js reset <email> <new-password>');
}

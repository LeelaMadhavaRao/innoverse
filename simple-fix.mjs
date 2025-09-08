// Simple Manual Fix Script using dynamic imports
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/innoverse_dev');

console.log('🔍 Finding team leaders...\n');

// Simple query using mongoose connection
const users = await mongoose.connection.db.collection('users').find({ 
  role: "team", 
  isTeamLeader: true 
}).toArray();

console.log(`Found ${users.length} team leaders:\n`);

for (const user of users) {
  console.log(`👤 Name: ${user.name}`);
  console.log(`📧 Email: ${user.email}`);
  console.log(`👥 Team: ${user.teamName || 'NOT SET'}`);
  console.log(`🔐 Password Hash: ${user.password ? 'EXISTS' : 'MISSING'}`);
  
  // Find corresponding team
  const team = await mongoose.connection.db.collection('teams').findOne({ 
    "teamLeader.email": user.email 
  });
  
  if (team) {
    console.log(`✅ Team Found: ${team.teamName}`);
    console.log(`🔑 Team Credentials: ${team.credentials ? 'EXISTS' : 'MISSING'}`);
    if (team.credentials) {
      console.log(`   Username: ${team.credentials.username}`);
      console.log(`   Password: ${team.credentials.password}`);
    }
  } else {
    console.log(`❌ No team record found`);
  }
  console.log('─'.repeat(50));
}

// If you want to reset a password, uncomment and modify these lines:
/*
const emailToReset = "team-leader@example.com"; // CHANGE THIS
const newPassword = "TempPass123!";             // CHANGE THIS

console.log(`\n🔐 Resetting password for: ${emailToReset}`);
const hashedPassword = await bcrypt.hash(newPassword, 12);

await mongoose.connection.db.collection('users').updateOne(
  { email: emailToReset, role: "team" },
  { $set: { password: hashedPassword } }
);

await mongoose.connection.db.collection('teams').updateOne(
  { "teamLeader.email": emailToReset },
  { 
    $set: { 
      "credentials.password": newPassword,
      "credentials.username": emailToReset
    }
  }
);

console.log(`✅ Password reset complete for ${emailToReset}`);
console.log(`🔑 New password: ${newPassword}`);
*/

await mongoose.disconnect();
console.log('\n✅ Done!');

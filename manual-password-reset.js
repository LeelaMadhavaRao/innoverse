// Manual Team Leader Password Reset
// Use this in MongoDB Compass or MongoDB shell

// 1. FIRST: Find the team leader's current record
db.users.find({ role: "team", isTeamLeader: true });

// 2. GENERATE NEW PASSWORD HASH
// Run this in Node.js console (node in terminal):
const bcrypt = require('bcryptjs');
const newPassword = 'TempPass123!'; // Use this temporary password
const hashedPassword = bcrypt.hashSync(newPassword, 12);
console.log('New Password:', newPassword);
console.log('Hashed Password:', hashedPassword);

// 3. UPDATE USER RECORD
// Replace 'team-leader@email.com' with the actual email
db.users.updateOne(
  { email: "team-leader@email.com" },
  { 
    $set: { 
      password: "PASTE_HASHED_PASSWORD_HERE"
    }
  }
);

// 4. UPDATE TEAM CREDENTIALS
// Replace 'team-leader@email.com' with the actual email
db.teams.updateOne(
  { "teamLeader.email": "team-leader@email.com" },
  { 
    $set: { 
      "credentials.password": "TempPass123!",
      "credentials.username": "team-leader@email.com"
    }
  }
);

// 5. VERIFY THE UPDATE
db.users.findOne({ email: "team-leader@email.com" }, { password: 1, email: 1, name: 1 });
db.teams.findOne({ "teamLeader.email": "team-leader@email.com" }, { credentials: 1, teamName: 1 });

// Now the team leader can login with:
// Email: team-leader@email.com
// Password: TempPass123!

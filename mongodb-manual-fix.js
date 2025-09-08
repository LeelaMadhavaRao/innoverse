// MongoDB Shell Script for Manual Fix
// Copy and paste these commands in MongoDB Compass or mongosh

// 1. FIND ALL TEAM LEADERS
print("🔍 Finding all team leaders...");
db.users.find({ role: "team", isTeamLeader: true }).forEach(function(user) {
  print("👤 Name: " + user.name);
  print("📧 Email: " + user.email);
  print("👥 Team: " + (user.teamName || "NOT SET"));
  print("🔐 Password Hash: " + (user.password ? "EXISTS" : "MISSING"));
  
  // Find corresponding team
  var team = db.teams.findOne({ "teamLeader.email": user.email });
  if (team) {
    print("✅ Team Found: " + team.teamName);
    print("🔑 Team Credentials: " + (team.credentials ? "EXISTS" : "MISSING"));
    if (team.credentials) {
      print("   Username: " + team.credentials.username);
      print("   Password: " + team.credentials.password);
    }
  } else {
    print("❌ No team record found");
  }
  print("─".repeat(50));
});

// 2. MANUAL PASSWORD RESET
// Replace 'YOUR_EMAIL_HERE' with the actual team leader email
// Replace 'NEW_PASSWORD_HERE' with a temporary password

var teamLeaderEmail = "YOUR_EMAIL_HERE";  // CHANGE THIS
var newPassword = "TempPass123!";         // CHANGE THIS IF NEEDED

print("\n🔐 Resetting password for: " + teamLeaderEmail);

// You need to generate the hash manually. Use this Node.js command:
// node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('TempPass123!', 12));"

var hashedPassword = "PASTE_GENERATED_HASH_HERE"; // CHANGE THIS

// Update user record
db.users.updateOne(
  { email: teamLeaderEmail, role: "team" },
  { $set: { password: hashedPassword } }
);

// Update team credentials
db.teams.updateOne(
  { "teamLeader.email": teamLeaderEmail },
  { 
    $set: { 
      "credentials.password": newPassword,
      "credentials.username": teamLeaderEmail
    }
  }
);

print("✅ Password reset complete!");
print("📧 Email: " + teamLeaderEmail);
print("🔑 Password: " + newPassword);

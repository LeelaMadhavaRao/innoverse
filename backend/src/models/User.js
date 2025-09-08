import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String }, // Add username field for team authentication
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'evaluator', 'team', 'faculty'], default: 'team' },
  name: { type: String, required: true },
  phone: String,
  profileImage: String,
  status: { type: String, enum: ['active', 'inactive', 'pending', 'suspended'], default: 'active' },
  emailVerified: { type: Boolean, default: false },
  loginCount: { type: Number, default: 0 },
  permissions: [String],
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    theme: { type: String, default: 'dark' },
    language: { type: String, default: 'en' }
  },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;

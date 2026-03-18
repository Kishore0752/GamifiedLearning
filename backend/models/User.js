const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // New password field
  department: String,
  year: Number,
  technicalInterests: [String],
  skillLevel: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Placement-Ready'], 
    default: 'Beginner' 
  },
  profilePicture: { type: String, default: null }, // URL or base64 string
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  solvedChallenges: [
    {
      challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
      date: String,
      difficulty: String
    }
  ]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
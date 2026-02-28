const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
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

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  xpReward: {
    type: Number,
    required: true,
    default: 50
  },
  examples: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],
  hints: [String],
  category: {
    type: String,
    enum: ['JavaScript', 'Python', 'DSA', 'Web Development', 'Database', 'General'],
    required: true
  },
  expectedAnswer: {
    type: String,
    required: true
  },
  solveCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  dayOfYear: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);

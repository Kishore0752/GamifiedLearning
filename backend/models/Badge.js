const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  iconUrl: String, 
  xpThreshold: Number, // Example: Earned at 500 XP
  category: { type: String, enum: ['Coding', 'Community', 'Project'] }
});

module.exports = mongoose.model('Badge', BadgeSchema);
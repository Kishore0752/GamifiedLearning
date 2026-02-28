const mongoose = require('mongoose');

const ContestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startTime: Date,
  endTime: Date,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  prizeXP: { type: Number, default: 500 } // Big XP boost for winners
}, { timestamps: true });

module.exports = mongoose.model('Contest', ContestSchema);
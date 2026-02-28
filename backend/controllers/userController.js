const User = require('../models/User');
const { calculateLevel } = require('../utils/xpCalculator');

exports.updateXP = async (req, res) => {
  try {
    const { userId, xpGained } = req.body;
    const user = await User.findById(userId);

    user.xp += xpGained;
    
    // Check for level up
    const newLevel = calculateLevel(user.xp);
    if (newLevel > user.level) {
      user.level = newLevel;
      // You could trigger a "Level Up" notification here
    }

    await user.save();
    res.status(200).json({ msg: "XP Updated", xp: user.xp, level: user.level });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
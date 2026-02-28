const User = require('../models/User');
const Badge = require('../models/Badge');

exports.checkAndAwardBadges = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    // Find badges the user doesn't have yet but qualifies for
    const eligibleBadges = await Badge.find({
      xpThreshold: { $lte: user.xp },
      _id: { $nin: user.badges }
    });

    if (eligibleBadges.length > 0) {
      const badgeIds = eligibleBadges.map(b => b._id);
      user.badges.push(...badgeIds);
      await user.save();
      return res.json({ msg: "New badges earned!", newBadges: eligibleBadges });
    }

    res.json({ msg: "No new badges at this time." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
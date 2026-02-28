const User = require('../models/User');
const Post = require('../models/Post');

exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('badges')
      .select('-password');
    
    // Get recent activity count for placement readiness
    const activityCount = await Post.countDocuments({ author: req.params.userId });

    res.json({
      profile: user,
      totalContributions: activityCount,
      readinessScore: Math.min((user.xp / 1000) * 100, 100) // Percentage toward "Placement Ready"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
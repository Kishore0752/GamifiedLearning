const User = require('../models/User');

exports.getGlobalLeaderboard = async (req, res) => {
  try {
    // Fetches top students globally based on earned experience points
    const topStudents = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select('name department xp level');
    
    res.json(topStudents);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch leaderboard data." });
  }
};

exports.getDeptLeaderboard = async (req, res) => {
  try {
    const { dept } = req.params;
    // Filters rankings by department to foster localized competition
    const deptTop = await User.find({ department: dept })
      .sort({ xp: -1 })
      .limit(10)
      .select('name xp level');
    
    res.json(deptTop);
  } catch (err) {
    res.status(500).json({ error: "Error fetching departmental rankings." });
  }
};
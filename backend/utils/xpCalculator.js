// Levels based on quadratic progression
// Level 1: 0 XP | Level 2: 100 XP | Level 3: 400 XP | Level 4: 900 XP
exports.calculateLevel = (xp) => {
  if (xp <= 0) return 1;
  return Math.floor(0.1 * Math.sqrt(xp)) + 1;
};

exports.XP_REWARDS = {
  SOLVE_CHALLENGE: 50,
  POST_DOUBT: 10,
  HELP_PEER: 15,
  DAILY_LOG_IN: 5
};
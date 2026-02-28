const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// Get today's challenge
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

    const challenge = await Challenge.findOne({ dayOfYear }).select('-expectedAnswer');

    if (!challenge) {
      return res.status(404).json({ error: 'No challenge for today' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// Submit challenge solution
router.post('/submit', async (req, res) => {
  try {
    const { userId, challengeId, solution } = req.body;

    if (!userId || !challengeId || !solution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already solved today's challenge
    if (!user.solvedChallenges) {
      user.solvedChallenges = [];
    }

    const today = new Date().toISOString().split('T')[0];
    const alreadySolved = user.solvedChallenges.some(
      (solve) => solve.challengeId.toString() === challengeId && solve.date === today
    );

    if (alreadySolved) {
      return res.status(400).json({ error: 'You already solved today\'s challenge' });
    }

    // Normalize solution for comparison (remove extra whitespace)
    const normalizedSolution = solution.trim().toLowerCase();
    const normalizedExpected = challenge.expectedAnswer.trim().toLowerCase();

    const isCorrect = normalizedSolution === normalizedExpected;

    if (isCorrect) {
      // Award XP
      user.xp = (user.xp || 0) + challenge.xpReward;
      user.level = Math.floor(user.xp / 100) + 1;

      // Record solve
      user.solvedChallenges.push({
        challengeId,
        date: today,
        difficulty: challenge.difficulty
      });

      // Increment solve count
      challenge.solveCount = (challenge.solveCount || 0) + 1;
      await challenge.save();
      await user.save();

      res.json({
        correct: true,
        feedback: `Excellent! 🎉 You earned ${challenge.xpReward} XP!`,
        xpEarned: challenge.xpReward
      });
    } else {
      res.json({
        correct: false,
        feedback: `Not quite right. Try again! 💪`,
        xpEarned: 0
      });
    }
  } catch (error) {
    console.error('Error submitting challenge:', error);
    res.status(500).json({ error: 'Failed to submit challenge' });
  }
});

module.exports = router;

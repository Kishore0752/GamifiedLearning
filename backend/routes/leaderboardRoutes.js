const express = require('express');
const router = express.Router();
const { getGlobalLeaderboard, getDeptLeaderboard } = require('../controllers/leaderboardController');

router.get('/global', getGlobalLeaderboard);
router.get('/dept/:dept', getDeptLeaderboard);

module.exports = router;
const express = require('express');
const router = express.Router();
const { checkAndAwardBadges } = require('../controllers/badgeController');

// This responds to GET http://localhost:5000/api/badges/check/:userId
router.get('/check/:userId', checkAndAwardBadges);

module.exports = router;
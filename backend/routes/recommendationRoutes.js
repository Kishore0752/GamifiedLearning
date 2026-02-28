const express = require('express');
const router = express.Router();
const { 
  getRecommendations, 
  getRecommendedCourses 
} = require('../controllers/recommendationController');

// Get personalized recommendations for a user
router.get('/:userId', getRecommendations);

// Get recommended courses for a user
router.get('/:userId/courses', getRecommendedCourses);

module.exports = router;

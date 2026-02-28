const express = require('express');
const router = express.Router();
const { 
  createContest, 
  getAllContests, 
  getContestById, 
  joinContest, 
  leaveContest, 
  submitSolution 
} = require('../controllers/contestController');

// Get all contests
router.get('/', getAllContests);

// Create a new contest (admin)
router.post('/create', createContest);

// Get a specific contest
router.get('/:id', getContestById);

// Join a contest
router.post('/join', joinContest);

// Leave a contest
router.post('/leave', leaveContest);

// Submit solution to a contest
router.post('/submit', submitSolution);

module.exports = router;

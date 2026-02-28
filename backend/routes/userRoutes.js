const express = require('express');
const router = express.Router();

// Import Controllers
const { updateXP } = require('../controllers/userController');
const { getUserStats } = require('../controllers/dashboardController');
const User = require('../models/User');

/**
 * @route   POST /api/users/register
 * @desc    Register a new student with institutional profile
 */
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this institutional email already exists." });
    }

    const newUser = new User(req.body);
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @route   GET /api/users/profile/:id
 * @desc    Get raw profile data for a specific user
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('badges');
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

/**
 * @route   GET /api/users/dashboard/:userId
 * @desc    Get calculated stats, readiness score, and activity for dashboard
 */
router.get('/dashboard/:userId', getUserStats);

/**
 * @route   POST /api/users/add-xp
 * @desc    Update XP and check for level-up milestones
 */
router.post('/add-xp', updateXP);

/**
 * @route   GET /api/users/all
 * @desc    Get all users (Useful for admin or testing)
 */
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('name email department xp level');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Login with email - simple login without password
 */
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: "User not found. Please register first." });
    }

    // Return user data for frontend to store in localStorage
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      year: user.year,
      xp: user.xp,
      level: user.level,
      msg: "Login successful"
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error during login", error: err.message });
  }
});

/**
 * @route   POST /api/users/update-profile-picture
 * @desc    Update user's profile picture
 */
router.post('/update-profile-picture', async (req, res) => {
  try {
    const { userId, profilePicture } = req.body;

    if (!userId || !profilePicture) {
      return res.status(400).json({ error: "User ID and profile picture are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      msg: "Profile picture updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile picture", details: err.message });
  }
});

module.exports = router;
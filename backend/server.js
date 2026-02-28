const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import Middlewares
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// --- Global Middleware ---
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Essential for parsing JSON bodies
app.use(logger); // Logs requests to the terminal for debugging

// --- Health Check Endpoint ---
app.get("/", (req, res) => {
  res.send("🚀 CampusQuest Backend Running Successfully");
});

// --- Route Mounting ---
// Every feature is separated into its own module for scalability

// 1. User Management (Registration, Profile, XP Update)
app.use('/api/users', require('./routes/userRoutes'));

// 2. Community Module (Posts, Comments, Peer Guidance)
app.use('/api/community', require('./routes/communityRoutes'));

// 3. Badge System (Dynamically awarded achievements)
app.use('/api/badges', require('./routes/badgeRoutes'));

// 4. Competitive Features (Leaderboards, Coding Contests)
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// 5. Daily Challenges (Solve daily coding puzzles)
app.use('/api/challenges', require('./routes/challengeRoutes'));

// 6. Contests (Competitive programming events)
app.use('/api/contests', require('./routes/contestRoutes'));

// 7. Recommendations (Personalized learning paths)
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

// 8. Dashboard (Aggregated stats & Placement readiness)
// (Ensure this is either in userRoutes or its own dashboardRoutes)

// --- Error Handling ---
// Global handler to prevent the app from crashing
app.use(errorHandler);

// --- Server Entry Point ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  --------------------------------------------------
  🎓 COLLEGE GAMIFICATION SYSTEM BACKEND 🎓
  --------------------------------------------------
  Status: Online
  Port: ${PORT}
  Database: Connected
  --------------------------------------------------
  `);
});
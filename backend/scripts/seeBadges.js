const mongoose = require('mongoose');
const Badge = require('../models/Badge');
require('dotenv').config();

const seedBadges = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const initialBadges = [
    { name: "Code Ninja", description: "Earned 100 XP in Coding", xpThreshold: 100, category: "Coding" },
    { name: "Community Helper", description: "Posted your first doubt", xpThreshold: 10, category: "Community" },
    { name: "Placement Ready", description: "Reached Level 10", xpThreshold: 5000, category: "Project" }
  ];

  await Badge.insertMany(initialBadges);
  console.log("Badges Seeded!");
  process.exit();
};

seedBadges();
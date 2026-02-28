// controllers/recommendationController.js
const User = require('../models/User');

// Get personalized recommendations based on user profile
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Recommendations map based on skill level and interests
    const recommendationDatabase = {
      beginner: {
        'Web Development': ['Learn HTML & CSS', 'Master JavaScript Basics', 'Build Your First Website', 'Learn Responsive Design', 'Start with React Fundamentals'],
        'Machine Learning': ['Python Fundamentals', 'NumPy & Pandas Basics', 'Introduction to ML Algorithms', 'Data Visualization', 'Linear Algebra Essentials'],
        'Database': ['SQL Fundamentals', 'Database Design Basics', 'Learn Normalization', 'CRUD Operations Practice', 'MongoDB Introduction'],
        'Mobile Development': ['App Development Basics', 'Learn UI/UX Fundamentals', 'Native Development Intro', 'Cross-platform Frameworks', 'Mobile App Design']
      },
      intermediate: {
        'Web Development': ['Advanced React Patterns', 'State Management (Redux/Context)', 'API Integration', 'Performance Optimization', 'Testing Strategies'],
        'Machine Learning': ['Advanced ML Algorithms', 'Feature Engineering', 'Model Evaluation', 'Deep Learning Basics', 'NLP Introduction'],
        'Database': ['Advanced SQL Queries', 'Database Optimization', 'Indexing Strategies', 'Replication & Backup', 'Scaling Databases'],
        'Mobile Development': ['State Management', 'Native Performance', 'Advanced Animations', 'Backend Integration', 'App Publishing']
      },
      'Placement-Ready': {
        'Web Development': ['System Design', 'Scalability Concepts', 'DevOps Basics', 'Cloud Deployment', 'Production Ready Code'],
        'Machine Learning': ['Production ML Systems', 'Model Deployment', 'MLOps', 'Advanced NLP/CV', 'Research Papers Study'],
        'Database': ['Distributed Databases', 'NoSQL Scaling', 'Data Warehousing', 'Real-time Processing', 'Advanced Security'],
        'Mobile Development': ['App Architecture', 'Advanced Security', 'App Optimization', 'Cross-platform Strategy', 'Publishing & Analytics']
      }
    };

    const userLevel = user.skillLevel || 'beginner';
    const userInterests = user.technicalInterests || ['Web Development'];
    
    // Build personalized recommendations
    const recommendations = [];
    userInterests.forEach(interest => {
      const paths = recommendationDatabase[userLevel] || recommendationDatabase['beginner'];
      const steps = paths[interest] || paths['Web Development'];
      recommendations.push({
        interest,
        suggestedSteps: steps,
        priority: 'high'
      });
    });
    
    res.json({
      userId: user._id,
      currentLevel: user.level,
      skillLevel: userLevel,
      xp: user.xp,
      recommendations,
      motivationalMessage: `Keep going, ${user.name}! You are on your way to becoming Placement Ready. 🚀`,
      nextMilestone: Math.ceil((user.xp + 1000) / 100) * 100 + " XP"
    });
  } catch (err) {
    res.status(500).json({ error: "Could not generate recommendations." });
  }
};

// Get recommended courses based on user interests
exports.getRecommendedCourses = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const courses = {
      'Web Development': [
        { title: 'React Masterclass', difficulty: 'intermediate', duration: '40 hours', rating: 4.8 },
        { title: 'Node.js & Express', difficulty: 'intermediate', duration: '35 hours', rating: 4.7 },
        { title: 'Advanced CSS', difficulty: 'beginner', duration: '25 hours', rating: 4.6 }
      ],
      'Machine Learning': [
        { title: 'Machine Learning A-Z', difficulty: 'intermediate', duration: '45 hours', rating: 4.8 },
        { title: 'Deep Learning Specialization', difficulty: 'advanced', duration: '50 hours', rating: 4.9 },
        { title: 'NLP with Python', difficulty: 'intermediate', duration: '35 hours', rating: 4.7 }
      ],
      'Database': [
        { title: 'SQL Mastery', difficulty: 'beginner', duration: '30 hours', rating: 4.7 },
        { title: 'MongoDB Complete Guide', difficulty: 'intermediate', duration: '28 hours', rating: 4.6 },
        { title: 'Database Design', difficulty: 'intermediate', duration: '40 hours', rating: 4.8 }
      ]
    };

    const interest = user.technicalInterests?.[0] || 'Web Development';
    const recommendedCourses = courses[interest] || courses['Web Development'];

    res.json({
      userId,
      interest,
      courses: recommendedCourses,
      message: `Perfect courses for your ${interest} journey!`
    });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch recommended courses." });
  }
};

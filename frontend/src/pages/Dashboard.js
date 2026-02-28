import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import ProfileCard from '../components/ProfileCard';
import BadgeItem from '../components/BadgeItem';
import Leaderboard from '../components/Leaderboard';
import { Zap, Award, Lightbulb } from 'lucide-react';
import { addXP, checkBadges, getUser } from '../services/api';

const Dashboard = () => {
    const { user, loading, updateUser } = useContext(UserContext);
    const [xpAmount, setXpAmount] = useState(10);
    const [addingXP, setAddingXP] = useState(false);
    const [userId, setUserId] = useState(null);
    const [suggestion, setSuggestion] = useState(null);

    // AI Suggestion Data Based on Level and Technology
    const suggestionDatabase = {
      beginner: {
        'Web Development': [
          { emoji: '🌐', title: 'HTML Basics', description: 'Master semantic HTML and structure 10 web pages today to level up!' },
          { emoji: '🎨', title: 'CSS Fundamentals', description: 'Create 3 responsive layouts using flexbox and grid!' },
          { emoji: '⚡', title: 'JavaScript Basics', description: 'Solve 5 DOM manipulation challenges!' },
          { emoji: '📱', title: 'Mobile-First Design', description: 'Build a mobile-first component using CSS media queries!' },
        ],
        'Machine Learning': [
          { emoji: '🤖', title: 'Python Basics', description: 'Complete 3 basic ML tutorials with NumPy and Pandas!' },
          { emoji: '📊', title: 'Data Visualization', description: 'Create 5 visualizations using Matplotlib or Seaborn!' },
          { emoji: '🔢', title: 'Linear Algebra', description: 'Solve 10 linear algebra problems relevant to ML!' },
        ],
        'Database': [
          { emoji: '🗄️', title: 'SQL Fundamentals', description: 'Write 5 SQL queries for basic CRUD operations!' },
          { emoji: '🔑', title: 'Database Design', description: 'Design a simple ER diagram with 5+ entities!' },
          { emoji: '📋', title: 'Normalization', description: 'Normalize 3 database schemas to 3NF!' },
        ],
        'Mobile Development': [
          { emoji: '📱', title: 'App Basics', description: 'Build a simple hello world app with proper structure!' },
          { emoji: '🎯', title: 'UI Components', description: 'Create 5 custom UI components for your app!' },
          { emoji: '🔄', title: 'State Management', description: 'Implement state in 2 different screens!' },
        ],
      },
      intermediate: {
        'Web Development': [
          { emoji: '⚛️', title: 'React Patterns', description: 'Master custom hooks by building 3 reusable hooks!' },
          { emoji: '🔗', title: 'API Integration', description: 'Connect to 3 different RESTful APIs!' },
          { emoji: '🎯', title: 'Performance Optimization', description: 'Optimize bundle size and improve Lighthouse score by 20 points!' },
          { emoji: '🧪', title: 'Testing', description: 'Write unit tests covering 80% of your component logic!' },
        ],
        'Machine Learning': [
          { emoji: '🧠', title: 'Supervised Learning', description: 'Build and evaluate 2 classification models!' },
          { emoji: '📈', title: 'Feature Engineering', description: 'Create 5 new features from raw data!' },
          { emoji: '⚙️', title: 'Model Tuning', description: 'Hyperparameter tune 2 models to improve accuracy by 5%!' },
        ],
        'Database': [
          { emoji: '🔍', title: 'Query Optimization', description: 'Optimize 5 slow queries using indexes and explain plans!' },
          { emoji: '🔐', title: 'Database Security', description: 'Implement encryption and implement role-based access!' },
          { emoji: '🔄', title: 'Transactions & ACID', description: 'Build 3 complex transactions with proper isolation levels!' },
        ],
        'Mobile Development': [
          { emoji: '🚀', title: 'Advanced Navigation', description: 'Implement deep linking and complex navigation flows!' },
          { emoji: '💾', title: 'Local Storage', description: 'Build offline-first app with proper sync mechanism!' },
          { emoji: '🔐', title: 'Security', description: 'Implement secure authentication and data encryption!' },
        ],
      },
      'placement-ready': {
        'Web Development': [
          { emoji: '🏗️', title: 'System Design', description: 'Design a scalable social media platform architecture!' },
          { emoji: '🚀', title: 'DevOps & Deployment', description: 'Set up CI/CD pipeline with Docker and Kubernetes!' },
          { emoji: '⚡', title: 'Advanced Performance', description: 'Implement server-side rendering and edge caching!' },
          { emoji: '🔐', title: 'Security Best Practices', description: 'Secure your app against OWASP top 10 vulnerabilities!' },
        ],
        'Machine Learning': [
          { emoji: '🤖', title: 'Deep Learning', description: 'Build and train a CNN model on image classification!' },
          { emoji: '📊', title: 'Big Data Processing', description: 'Process terabyte scale data using Spark!' },
          { emoji: '🎯', title: 'Production ML', description: 'Deploy ML model with monitoring and versioning!' },
          { emoji: '🔍', title: 'Research Paper Implementation', description: 'Implement a recent ML research paper!' },
        ],
        'Database': [
          { emoji: '📊', title: 'Big Data Systems', description: 'Design a data warehouse with star schema!' },
          { emoji: '⚙️', title: 'Distributed Databases', description: 'Set up distributed database with replication and sharding!' },
          { emoji: '🔬', title: 'Advanced Analytics', description: 'Build real-time analytics pipeline with complex aggregations!' },
        ],
        'Mobile Development': [
          { emoji: '🏆', title: 'App Optimization', description: 'Achieve 60 FPS performance across all screens!' },
          { emoji: '🌍', title: 'App Scaling', description: 'Build backend for 10K+ concurrent users!' },
          { emoji: '📊', title: 'Analytics & Monetization', description: 'Implement analytics and integrate payment systems!' },
        ],
      },
    };

    const generateSuggestion = () => {
      if (!user) return null;

      const userLevel = user.skillLevel?.toLowerCase() === 'placement-ready' ? 'placement-ready' 
                       : user.skillLevel?.toLowerCase() === 'intermediate' ? 'intermediate' 
                       : 'beginner';
      
      const userTech = user.technicalInterests?.[0] || 'Web Development';
      
      const levelSuggestions = suggestionDatabase[userLevel]?.[userTech] 
                              || suggestionDatabase[userLevel]?.['Web Development']
                              || [];

      if (levelSuggestions.length === 0) return null;

      // Get different suggestion based on day of month for daily rotation
      const dayOfMonth = new Date().getDate();
      const suggestionIndex = dayOfMonth % levelSuggestions.length;
      
      return levelSuggestions[suggestionIndex];
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId);
        if (storedUserId && !user) {
            // Load user data if not already in context
            loadUserData(storedUserId);
        }
    }, []);

    useEffect(() => {
        // Generate suggestion whenever user changes
        if (user) {
            const newSuggestion = generateSuggestion();
            setSuggestion(newSuggestion);
        }
    }, [user]);

    const loadUserData = async (id) => {
        try {
            const userData = await getUser(id);
            if (updateUser) {
                updateUser(userData);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
        }
    };

    const handleAddXP = async () => {
        const currentUserId = userId || (user && user._id);
        if (!currentUserId) {
            alert('Please wait for user data to load');
            return;
        }
        setAddingXP(true);
        try {
            const result = await addXP(currentUserId, xpAmount);
            console.log('XP Added:', result);
            // Reload user data
            if (userId) {
                loadUserData(userId);
            }
            alert(`Added ${xpAmount} XP!`);
            setXpAmount(10);
        } catch (error) {
            console.error('Failed to add XP:', error);
            alert('Failed to add XP. Make sure backend is running!');
        } finally {
            setAddingXP(false);
        }
    };

    const handleCheckBadges = async () => {
        const currentUserId = userId || (user && user._id);
        if (!currentUserId) {
            alert('Please wait for user data to load');
            return;
        }
        try {
            const result = await checkBadges(currentUserId);
            console.log('Badge Check:', result);
            // Reload user data
            if (userId) {
                loadUserData(userId);
            }
            alert('Badges checked!');
        } catch (error) {
            console.error('Failed to check badges:', error);
            alert('Failed to check badges. Make sure backend is running!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="text-4xl mb-4">🎮</div>
                    <p className="text-slate-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-5xl font-black mb-2">
                    <span className="gradient-text">Welcome Back,</span>
                    <br />
                    <span className="text-white">{user?.name || 'Student'}</span> 👋
                </h1>
                <p className="text-slate-400 mt-2">Track your progress and unlock achievements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Card */}
                    <ProfileCard user={user} />

                    {/* Badges Section */}
                    <div className="glass-card p-8 animate-fade-in">
                        <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-500" /> Your Achievements
                        </h3>
                        {user?.badges && user.badges.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {user.badges.map((badge, idx) => (
                                    <BadgeItem key={idx} badge={badge} locked={false} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-center py-8">
                                Earn badges by completing achievements! Check badges below to see what you can unlock.
                            </p>
                        )}
                    </div>

                    {/* AI Suggestion */}
                    {suggestion && (
                    <div className="glass-card p-8 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <Lightbulb className="w-5 h-5 text-yellow-400" />
                                <h3 className="font-bold text-sm uppercase text-slate-400">Daily Suggestion ({user?.skillLevel})</h3>
                            </div>
                            <p className="text-xl font-semibold text-white">
                                {suggestion.title}
                            </p>
                            <p className="text-slate-300 mt-2">{suggestion.description}</p>
                            <p className="text-xs text-slate-500 mt-4">Suggestion rotates daily based on your level and interests</p>
                        </div>
                    </div>
                    )}

                    {/* API Test Section */}
                    <div className="glass-card p-8 animate-fade-in">
                        <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-blue-400" /> Test API Endpoints
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="form-group">
                                <label className="form-label">Add XP Amount</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="number" 
                                        value={xpAmount}
                                        onChange={(e) => setXpAmount(Number(e.target.value))}
                                        className="input-enhanced flex-1"
                                        min="1"
                                        max="1000"
                                    />
                                    <button
                                        onClick={handleAddXP}
                                        disabled={addingXP}
                                        className="btn-gradient px-8 disabled:opacity-50"
                                    >
                                        {addingXP ? '⏳' : '➕'} {addingXP ? 'Adding...' : 'Add XP'}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckBadges}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg btn-smooth neon-glow flex items-center justify-center gap-2"
                            >
                                <Award className="w-5 h-5" /> Check Badges
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Leaderboard */}
                <div className="lg:col-span-1">
                    <Leaderboard />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
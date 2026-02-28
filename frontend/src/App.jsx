import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { UserProvider } from './context/UserContext';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import LeaderboardPage from './pages/LeaderboardPage';
import DailyChallenges from './pages/DailyChallenges';
import Login from './pages/Login';
import Register from './pages/Register';
import UserSearch from './pages/UserSearch';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    setIsAuthenticated(!!userId);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black gradient-text mb-4">🎮</div>
          <p className="text-slate-300">Loading CAMPUSQUEST...</p>
        </div>
      </div>
    );
  }

  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          {isAuthenticated && <Navbar />}
          <main className="w-full">
            <Routes>
              {/* Auth Routes - Show when NOT logged in */}
              {!isAuthenticated ? (
                <>
                  <Route path="/" element={<Login />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </>
              ) : (
                <>
                  {/* Protected Routes - Show when logged in */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/daily-challenges" element={<DailyChallenges />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/search" element={<UserSearch />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </>
              )}
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
